import { type ValidBookingRequestPayload } from "@/lib/booking";

type BookingConfirmationTemplateProps = {
  bookingEmail: string;
  request: ValidBookingRequestPayload;
};

export function BookingConfirmationTemplate({
  bookingEmail,
  request,
}: BookingConfirmationTemplateProps) {
  const { name, date, type, city, org, message } = request;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        backgroundColor: "#f4f4f6",
        color: "#1a1a1a",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "12px",
            color: "#c51f1f",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Booking Request Received
        </h2>

        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
            marginBottom: "18px",
          }}
        >
          Hi {name},
          <br />
          <br />
          We have received your booking request for <strong>Until They Fall</strong>.
          We will review it and get back to you as soon as possible.
        </p>

        <div
          style={{
            display: "block",
            padding: "16px",
            background: "#fafafa",
            borderRadius: "10px",
            border: "1px solid #e5e5e5",
            marginBottom: "20px",
          }}
        >
          <Detail label="Requested date" value={date} />
          <Detail label="Event type" value={type} />
          <Detail label="City / Country" value={city} />
          <Detail label="Organizer" value={org} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              fontWeight: "700",
              color: "#111",
            }}
          >
            Your message
          </h3>
          <p
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
              background: "#f8f8f8",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #e2e2e2",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        </div>

        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "0",
          }}
        >
          If you need to add details, just reply to this email or contact us at{" "}
          <a href={`mailto:${bookingEmail}`} style={{ color: "#c51f1f" }}>
            {bookingEmail}
          </a>
          .
        </p>

        <p
          style={{
            marginTop: "32px",
            fontSize: "12px",
            color: "#777",
            textAlign: "center",
          }}
        >
          Booking system - Until They Fall {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p
      style={{
        margin: "4px 0",
        fontSize: "14px",
        color: "#333",
      }}
    >
      <strong>{label}:</strong> {value || "-"}
    </p>
  );
}
