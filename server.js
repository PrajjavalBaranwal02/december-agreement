
require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "12mb" }));
app.use(express.static(path.join(__dirname, "public")));

function missingEmailConfig() {
  return !process.env.RESEND_API_KEY ||
    !process.env.NOTIFY_EMAIL ||
    !process.env.FROM_EMAIL;
}

function getWhatsAppUrl({ signedAt }) {
  const phone = (process.env.NOTIFY_WHATSAPP_TO || "")
    .replace(/^whatsapp:/i, "")
    .replace(/\D/g, "");

  if (!phone) return null;

  const message =
    `📜 OFFICIAL NOTIFICATION\n\n` +
    `Vaishu has signed the 11th December Ownership Agreement! ❤️\n\n` +
    `Status: APPROVED\n` +
    `Signed: ${new Date(signedAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    })} (India time)\n\n` +
    `The day is officially reserved. No excuses, only adventures!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

async function sendEmail({ signedAt, pdfBase64 }) {
  const payload = {
    from: process.env.FROM_EMAIL,
    to: [process.env.NOTIFY_EMAIL],
    subject: "Vaishu signed the 11th December Ownership Agreement ❤️",
    html: `
      <div style="font-family:Georgia,serif;color:#29251f;max-width:620px;margin:auto;padding:28px;border:1px solid #c5a76b">
        <p style="letter-spacing:3px;color:#9a7b43;font-size:11px">OFFICIAL NOTICE · DEPARTMENT OF UNNECESSARY LOVE</p>
        <h1 style="font-weight:normal">The agreement has been signed.</h1>
        <p>Vaishu has officially accepted the 11th December Ownership Agreement.</p>
        <p><strong>Signed at:</strong> ${new Date(signedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata"
        })} (India time)</p>
        <p>The signed PDF is attached to this email.</p>
        <p style="color:#9a7b43;font-style:italic">No refunds. Only memories. ❤️</p>
      </div>`,
    attachments: [{
      filename: "11-December-Ownership-Agreement-SIGNED.pdf",
      content: pdfBase64
    }]
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Email provider rejected the request");
  }

  return data;
}

app.post("/api/sign", async (req, res) => {
  const { signer, signedAt, pdfBase64, consent } = req.body || {};

  if (
    signer !== "Vaishu" ||
    consent !== true ||
    !signedAt ||
    typeof pdfBase64 !== "string"
  ) {
    return res.status(400).json({
      error: "A valid Vaishu consent and signed PDF are required."
    });
  }

  if (!pdfBase64.startsWith("JVBER")) {
    return res.status(400).json({
      error: "The attached document does not appear to be a valid PDF."
    });
  }

  const results = {
    email: "not_configured",
    whatsapp: "not_configured"
  };

  const errors = [];

  if (!missingEmailConfig()) {
    try {
      await sendEmail({ signedAt, pdfBase64 });
      results.email = "sent";
    } catch (e) {
      results.email = "failed";
      errors.push(`Email: ${e.message}`);
    }
  } else {
    errors.push("Email is not configured in .env.");
  }

  const whatsappUrl = getWhatsAppUrl({ signedAt });

  if (whatsappUrl) {
    results.whatsapp = "ready_to_send";
  } else {
    errors.push("WhatsApp phone number is missing from .env.");
  }

  return res.status(200).json({
    ok: true,
    notifications: results,
    whatsappUrl,
    message: "The agreement was signed successfully.",
    setupErrors: errors
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Agreement website running at http://localhost:${PORT}`);
});
