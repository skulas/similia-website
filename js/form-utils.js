const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://similia-website.onrender.com';

function pingBackend() { fetch(`${API_BASE_URL}/api/heartbeat`).catch(() => {}); }
pingBackend();
setInterval(pingBackend, 60000);

async function submitToBackend(payload) {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return res.json();
}
