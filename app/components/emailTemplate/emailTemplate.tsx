import { EmailContent } from "@/app/api/send/route";

export function EmailTemplate(props: EmailContent) {
    const { name, email, message, date, type, budget, capacity, city, org } = props;

    return (
        <div
        style={{
            fontFamily: "Arial, sans-serif",
            padding: "24px",
            backgroundColor: "#f4f4f6",
            color: "#1a1a1a",
        }}
        >
        {/* Wrapper */}
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
            {/* Title */}
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
            New Booking Request
            </h2>

            <p
            style={{
                fontSize: "15px",
                lineHeight: "1.5",
                marginBottom: "18px",
            }}
            >
            You just received a new booking request for <strong>Until They Fall</strong>.
            </p>

            {/* Details */}
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
            <Detail label="Name" value={name} />
            <Detail label="Email" value={email} />
            <Detail label="Date" value={date} />
            <Detail label="Event Type" value={type} />
            <Detail label="Budget" value={budget} />
            <Detail label="Capacity" value={capacity} />
            <Detail label="City" value={city} />
            <Detail label="Org" value={org} />
            </div>

            {/* Message */}
            <div style={{ marginBottom: "28px" }}>
            <h3
                style={{
                fontSize: "16px",
                marginBottom: "8px",
                fontWeight: "700",
                color: "#111",
                }}
            >
                Message:
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

            {/* Button */}
            <a
            href={`mailto:${email}`}
            style={{
                display: "inline-block",
                padding: "12px 20px",
                backgroundColor: "#c51f1f",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                letterSpacing: "0.5px",
            }}
            >
            Reply to {name}
            </a>

            {/* Footer */}
            <p
            style={{
                marginTop: "32px",
                fontSize: "12px",
                color: "#777",
                textAlign: "center",
            }}
            >
            Booking system — Until They Fall © {new Date().getFullYear()}
            </p>
        </div>
        </div>
    );
};

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
};
