"use client";

/*
 * Lets a page-load signature (CSS-only, e.g. the Hero) play once per tab.
 * The animation starts with the server-rendered first paint, so a real
 * document load always plays it. When the owner remounts later in the same
 * app session (client navigation back to Home), this marks the nearest
 * [data-signature] ancestor with data-signature-played at commit, before
 * paint, so the settled state shows at once. In-memory only: no storage.
 */

const played = new Set<string>();
/* Strict Mode re-invokes ref callbacks on the same element; count it once */
const seen = new WeakSet<Element>();

function attachFor(name: string) {
  return (marker: HTMLSpanElement | null) => {
    const owner = marker?.closest<HTMLElement>("[data-signature]");
    if (!owner || seen.has(owner)) return;
    seen.add(owner);
    if (played.has(name)) owner.dataset.signaturePlayed = "";
    played.add(name);
  };
}

export default function SignatureOnce({ name }: { name: string }) {
  return <span ref={attachFor(name)} hidden />;
}
