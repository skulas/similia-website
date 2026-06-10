const express = require('express');
const cors = require('cors');
const https = require('https');
const querystring = require('querystring');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'gargerim@gmail.com';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

function verifyRecaptcha(token) {
    return new Promise((resolve) => {
        const params = querystring.stringify({ secret: RECAPTCHA_SECRET, response: token });
        const req = https.request({
            hostname: 'www.google.com',
            path: '/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(params)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { resolve({ success: false }); }
            });
        });
        req.on('error', () => resolve({ success: false }));
        req.write(params);
        req.end();
    });
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`[LOGIN TIMELINE] Attempt made by: "${username}"`);
    setTimeout(() => {
        res.status(401).json({
            success: false,
            message: "שם המשתמש או הסיסמה שגויים. לצרכי אבטחה וסימולציה, הגישה חסומה."
        });
    }, 800);
});

app.post('/api/contact', async (req, res) => {
    const { name, phone, email, program, message, recaptchaToken } = req.body;

    if (!recaptchaToken) {
        return res.status(400).json({ success: false, message: "נדרש אימות reCAPTCHA." });
    }

    const captchaResult = await verifyRecaptcha(recaptchaToken);
    if (!captchaResult.success) {
        return res.status(400).json({ success: false, message: "אימות reCAPTCHA נכשל. אנא נסה שוב." });
    }

    const emailBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
            <h2 style="color: #20436d; border-bottom: 2px solid #c9a84c; padding-bottom: 10px;">פנייה חדשה מאתר סימיליה</h2>
            <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
                <tr style="background: #f5f0e8;"><td style="padding: 10px 14px; font-weight: bold; width: 120px;">שם:</td><td style="padding: 10px 14px;">${name}</td></tr>
                <tr><td style="padding: 10px 14px; font-weight: bold;">טלפון:</td><td style="padding: 10px 14px;">${phone}</td></tr>
                <tr style="background: #f5f0e8;"><td style="padding: 10px 14px; font-weight: bold;">אימייל:</td><td style="padding: 10px 14px;">${email}</td></tr>
                <tr><td style="padding: 10px 14px; font-weight: bold;">מסלול:</td><td style="padding: 10px 14px;">${program}</td></tr>
                <tr style="background: #f5f0e8;"><td style="padding: 10px 14px; font-weight: bold;">הודעה:</td><td style="padding: 10px 14px;">${message || '—'}</td></tr>
            </table>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"אתר סימיליה" <${process.env.SMTP_USER}>`,
            to: RECIPIENT_EMAIL,
            subject: `פנייה חדשה: ${name} — ${program}`,
            html: emailBody
        });
        console.log(`[CONTACT] Email sent to ${RECIPIENT_EMAIL} | Name: ${name} | Program: ${program}`);
        res.json({ success: true, message: `תודה, ${name}! פנייתך בנושא "${program}" התקבלה בהצלחה בסימיליה.` });
    } catch (err) {
        console.error('[EMAIL ERROR]', err.message);
        res.status(500).json({ success: false, message: "שגיאה בשליחת הפנייה. אנא נסה שוב מאוחר יותר." });
    }
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Similia School Backend running on port ${PORT}`);
    console.log(`========================================`);
});
