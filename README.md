# The 11th December Ownership Agreement

A responsive, luxury-style interactive agreement for Vaishu. It includes:
- Mobile-friendly legal-document layout
- Consent popup with YES / decline options
- Animated “Vaishu” signature and approval seal
- Signed PDF export
- Email notification with PDF attachment through Resend
- WhatsApp notification through Twilio

## 1. Requirements
- Node.js 18+
- A Resend account and API key for email
- A Twilio account with WhatsApp enabled (sandbox or approved sender) for WhatsApp

## 2. Install and run
```bash
npm install
cp .env.example .env
```
On Windows PowerShell, use:
```powershell
Copy-Item .env.example .env
```
Edit `.env` and fill in the real credentials and destination WhatsApp number, then:
```bash
npm start
```
Open `http://localhost:3000`.

## 3. Email setup (Resend)
1. Create an API key at https://resend.com/api-keys
2. Put it in `RESEND_API_KEY`.
3. Set `NOTIFY_EMAIL=anuj...@gmail.com` (replace with the full intended notification address).
4. For production, verify a domain in Resend and use a sender address on that domain in `FROM_EMAIL`. Resend's onboarding sender is suitable only for limited testing and may only deliver to the account owner.

The email contains the signed PDF attachment.

## 4. WhatsApp setup (Twilio)
1. Enable WhatsApp in Twilio and configure the WhatsApp Sandbox or an approved WhatsApp sender.
2. Put your Account SID and Auth Token in `.env`.
3. Set `TWILIO_WHATSAPP_FROM` to your Twilio WhatsApp sender, usually `whatsapp:+14155238886` for the sandbox.
4. Set `NOTIFY_WHATSAPP_TO` to your own number in international format, e.g. `whatsapp:+91XXXXXXXXXX`.
5. For the Twilio Sandbox, the receiving number must first join the sandbox using the join code shown in your Twilio console.

WhatsApp receives a notification message. The signed PDF is attached to the email. Twilio sandbox/WhatsApp business rules may limit who can be messaged and when.

## 5. Put it online
Deploy the project to a Node.js host such as Render, Railway, or a VPS. Set the same environment variables in the host's environment settings and set `BASE_URL` to your public HTTPS URL. Share that public URL with Vaishu.

**Important:** Do not share `.env`, API keys, or Twilio credentials. Keep them only in the server's private environment settings.

## 6. Important notes
- The website does not send notifications from a plain local HTML file. The included Node server handles notification delivery.
- Email and WhatsApp notifications will work only after valid provider credentials and recipient details are configured.
- This is a playful personal agreement, not a legal contract. The recipient can decline consent.
- This starter stores no permanent signature database. The signed PDF is generated in the browser and transmitted to the server for notification delivery.
