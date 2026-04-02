"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { BOOKING_TURNSTILE_ACTION } from "@/lib/turnstile.shared";
import styles from "../../booking/booking.module.css";

type TurnstileRenderOptions = {
  action?: string;
  callback?: (token: string) => void;
  "error-callback"?: (errorCode?: string) => void;
  "expired-callback"?: () => void;
  sitekey: string;
  size?: "compact" | "flexible" | "normal";
  theme?: "auto" | "dark" | "light";
  "timeout-callback"?: () => void;
};

type TurnstileApi = {
  remove: (widgetId: string) => void;
  render: (
    container: HTMLElement | string,
    options: TurnstileRenderOptions
  ) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type BookingTurnstileProps = {
  onTokenChange: (token: string) => void;
  resetCounter: number;
  siteKey: string;
};

export default function BookingTurnstile({
  onTokenChange,
  resetCounter,
  siteKey,
}: BookingTurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (
      !scriptReady ||
      !containerRef.current ||
      widgetIdRef.current ||
      !window.turnstile
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: BOOKING_TURNSTILE_ACTION,
      theme: "auto",
      size: "flexible",
      callback: (token) => onTokenChange(token),
      "error-callback": () => onTokenChange(""),
      "expired-callback": () => onTokenChange(""),
      "timeout-callback": () => onTokenChange(""),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, scriptReady, siteKey]);

  useEffect(() => {
    if (!resetCounter || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    onTokenChange("");
    window.turnstile.reset(widgetIdRef.current);
  }, [onTokenChange, resetCounter]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <div className={styles.turnstileBlock}>
        <p className={styles.turnstileLabel}>
          Verification <span className={styles.req}>*</span>
        </p>
        <div ref={containerRef} className={styles.turnstileWidget} />
        <p className={`${styles.turnstileHint} text-muted`}>
          Protected by Cloudflare Turnstile.
        </p>
      </div>
    </>
  );
}
