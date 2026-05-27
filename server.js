const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const activeCaptchas = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [id, data] of activeCaptchas.entries()) {
        if (now > data.expires) {
            activeCaptchas.delete(id);
        }
    }
}, 10 * 60 * 1000);

app.get('/api/captcha', (req, res) => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const solution = num1 + num2;
    const captchaId = Math.random().toString(36).substring(2, 15);
    
    activeCaptchas.set(captchaId, {
        solution: solution,
        expires: Date.now() + 5 * 60 * 1000
    });
    
    res.json({
        captchaId: captchaId,
        question: `כמה זה ${num1} + ${num2}?`
    });
});

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

app.post('/api/contact', (req, res) => {
    const { name, phone, email, program, message, captchaId, captchaAnswer } = req.body;
    
    if (!captchaId || !activeCaptchas.has(captchaId)) {
        return res.status(400).json({
            success: false,
            message: "פג תוקפו של קוד הקפצ'ה. אנא רענן את העמוד ונסה שנית."
        });
    }
    
    const captchaData = activeCaptchas.get(captchaId);
    if (Date.now() > captchaData.expires) {
        activeCaptchas.delete(captchaId);
        return res.status(400).json({
            success: false,
            message: "קוד הקפצ'ה פג תוקף. אנא נסה שוב."
        });
    }
    
    if (parseInt(captchaAnswer) !== captchaData.solution) {
        return res.status(400).json({
            success: false,
            message: "פתרון הקפצ'ה שגוי. אנא ודא את החישוב ונסה שנית."
        });
    }
    
    activeCaptchas.delete(captchaId);
    console.log(`[CONTACT INQUIRY SUCCESS] Name: ${name} | Program: ${program}`);
    
    res.json({
        success: true,
        message: `תודה, ${name}! פנייתך בנושא "${program}" התקבלה בהצלחה בסימיליה.`
    });
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Similia School Backend running on port ${PORT}`);
    console.log(`========================================`);
});
