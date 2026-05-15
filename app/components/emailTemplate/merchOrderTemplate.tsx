import type { MerchOrderSummary } from "@/app/api/merch/order/route";

const EMAIL_ACCENT = "#8F30FF";

type MerchOrderTemplateProps = {
  order: MerchOrderSummary;
};

export function MerchOrderTemplate({ order }: MerchOrderTemplateProps) {
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
          maxWidth: "640px",
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
            color: EMAIL_ACCENT,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          New Merch Order Request
        </h2>

        <p style={{ fontSize: "15px", lineHeight: "1.5", marginBottom: "18px" }}>
          A new merch order request came in from <strong>{order.customerName}</strong>.
        </p>

        <Section>
          <Detail label="Order" value={order.orderNumber} />
          <Detail label="Name" value={order.customerName} />
          <Detail label="Email" value={order.email} />
          <Detail label="Country" value={order.country} />
        </Section>

        <h3 style={headingStyle}>Items</h3>
        <table style={tableStyle} cellPadding={0} cellSpacing={0}>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td style={cellStyle}>
                  <strong>{item.name}</strong>
                  <br />
                  <span style={{ color: "#777" }}>Qty {item.quantity}</span>
                </td>
                <td style={{ ...cellStyle, textAlign: "right" }}>
                  {formatPrice(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Section>
          <Detail label="Subtotal" value={formatPrice(order.subtotal)} />
          <Detail label="Shipping estimate" value={formatPrice(order.shipping)} />
          <Detail label="Estimated total" value={formatPrice(order.total)} />
        </Section>

        {order.notes && (
          <>
            <h3 style={headingStyle}>Customer notes</h3>
            <p style={messageStyle}>{order.notes}</p>
          </>
        )}

        <a
          href={`mailto:${order.email}`}
          style={{
            display: "inline-block",
            padding: "12px 20px",
            backgroundColor: EMAIL_ACCENT,
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          Reply to {order.customerName}
        </a>

        <p style={footerStyle}>
          Merch order system - Until They Fall {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export function MerchOrderConfirmationTemplate({
  order,
  merchEmail,
}: MerchOrderTemplateProps & { merchEmail: string }) {
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
          maxWidth: "640px",
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
            color: EMAIL_ACCENT,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Merch Request Received
        </h2>

        <p style={{ fontSize: "15px", lineHeight: "1.6", marginBottom: "18px" }}>
          Hi {order.customerName},
          <br />
          <br />
          We received your merch order request for <strong>Until They Fall</strong>.
          No payment has been taken yet. We will confirm availability, shipping and
          payment details by email.
        </p>

        <Section>
          <Detail label="Order" value={order.orderNumber} />
          <Detail label="Country" value={order.country} />
          <Detail label="Estimated total" value={formatPrice(order.total)} />
        </Section>

        <h3 style={headingStyle}>Requested items</h3>
        <table style={tableStyle} cellPadding={0} cellSpacing={0}>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td style={cellStyle}>
                  <strong>{item.name}</strong>
                  <br />
                  <span style={{ color: "#777" }}>Qty {item.quantity}</span>
                </td>
                <td style={{ ...cellStyle, textAlign: "right" }}>
                  {formatPrice(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "0" }}>
          If you need to change anything, reply to this email or contact us at{" "}
          <a href={`mailto:${merchEmail}`} style={{ color: EMAIL_ACCENT }}>
            {merchEmail}
          </a>
          .
        </p>

        <p style={footerStyle}>
          Merch order system - Until They Fall {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function Section({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ margin: "4px 0", fontSize: "14px", color: "#333" }}>
      <strong>{label}:</strong> {value || "-"}
    </p>
  );
}

const headingStyle = {
  fontSize: "16px",
  marginBottom: "8px",
  fontWeight: "700",
  color: "#111",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginBottom: "20px",
};

const cellStyle = {
  padding: "12px 0",
  borderBottom: "1px solid #e5e5e5",
  fontSize: "14px",
  color: "#333",
};

const messageStyle = {
  whiteSpace: "pre-wrap" as const,
  lineHeight: "1.5",
  background: "#f8f8f8",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #e2e2e2",
  fontSize: "14px",
};

const footerStyle = {
  marginTop: "32px",
  fontSize: "12px",
  color: "#777",
  textAlign: "center" as const,
};
