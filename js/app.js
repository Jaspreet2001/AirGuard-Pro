/**
 * GasMonitor Pro - Central Dashboard Application Logic
 * Automatically connects to the live Render backend regardless of where it is hosted.
 */

// ── 1. Global State Storage ───────────────────────────────────────────
// Centralized store to manage all sensor data, history, and UI states.
const store = {
    mq2: 0,
    mq135: 0,
    mq2History: [],
    mq135History: [],
    sparkMQ2: Array(30).fill(0),
    sparkMQ135: Array(30).fill(0),
    records: [],
    totalReads: 0,
    sessionStart: Date.now(),
    lastDataTime: Date.now(), // Tracks the last time Server sent data
    
    // Threshold & Alert State Settings
    warnThresh: 400,
    dangerThresh: 1000,
    cooldown: 15,
    lastAlertTime: 0,
    alertsFired: 0,
    alertsEnabled: true
};

let activeFSSensor = null;

// ── 2. Universal Socket.io Integration ────────────────────────────────
// EXTREMELY IMPORTANT: By hardcoding the Render URL here, your GitHub Pages, 
// Localhost, and Render frontend will all fetch the exact same data simultaneously!
const SOCKET_URL = 'https://house-monitoring-1.onrender.com';
const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'], // Fallback options for stability
    reconnection: true,
    reconnectionAttempts: 10
});

// Connection Event Listeners for Debugging
socket.on('connect', () => {
    console.log(`🟢 Connected successfully to live server at ${SOCKET_URL}`);
    showToast('Live server connection established', 'success');
});

socket.on('disconnect', () => {
    console.warn('🔴 Disconnected from live server. Attempting to reconnect...');
});

// Main Data Listener
socket.on('sensorUpdate', (data) => {
    if (data) {
        // Parse incoming data, default to 0 if undefined
        const mq2 = Number(data.mq2_ppm) || 0;
        const mq135 = Number(data.mq135_ppm) || 0;
        
        processSensorData(mq2, mq135);
    }
});

// ── 3. Core Data Processing Engine ────────────────────────────────────
function processSensorData(mq2, mq135) {
    store.lastDataTime = Date.now(); // Update connection heartbeat
    store.mq2 = mq2;
    store.mq135 = mq135;
    
    // Manage History Arrays (Max 60 data points for main charts)
    store.mq2History.push(mq2);
    store.mq135History.push(mq135);
    if(store.mq2History.length > 60) store.mq2History.shift();
    if(store.mq135History.length > 60) store.mq135History.shift();
    
    // Manage Sparkline Arrays (Max 30 data points)
    store.sparkMQ2.push(mq2);
    store.sparkMQ2.shift();
    store.sparkMQ135.push(mq135);
    store.sparkMQ135.shift();

    // Log records for the data table (Max 100 entries)
    store.records.unshift({sensor: 'MQ2', value: mq2, ts: Date.now()});
    store.records.unshift({sensor: 'MQ135', value: mq135, ts: Date.now()});
    if(store.records.length > 100) store.records.splice(100); 

    store.totalReads += 2;

    // Trigger all UI Updates
    updateSensor('mq2', mq2);
    updateSensor('mq135', mq135);
    updateAQI(mq2, mq135);
    updateStats('mq2', store.mq2History);
    updateStats('mq135', store.mq135History);
    drawSparkline('spark-mq2', store.sparkMQ2, '#63c8ff');
    drawSparkline('spark-mq135', store.sparkMQ135, '#a78bfa');
    drawHistoryChart(); 
    renderRecords();
    updateSystemStats();
    
    // Process Alerts & UI Health changes
    checkAlerts(mq2, mq135);
    
    // Update Full-Screen view dynamically if it is currently open
    if (activeFSSensor) updateFSView();
}

// ── 4. Visual UI Updaters (Gauges & Charts) ───────────────────────────
function updateSensor(id, val) {
    const valEl = document.getElementById(`${id}-val`);
    if (valEl) valEl.innerText = val;

    const fillEl = document.getElementById(`${id}-fill`);
    const glowEl = document.getElementById(`${id}-glow`);
    
    if (fillEl && glowEl) {
        const maxVal = 1400; 
        const pct = Math.min(val / maxVal, 1);
        const circumference = 2 * Math.PI * 80; 
        
        // Update SVG Stroke to animate the ring
        fillEl.style.strokeDasharray = `${circumference} ${circumference}`;
        fillEl.style.strokeDashoffset = circumference - (pct * circumference);
        
        glowEl.style.strokeDasharray = `${circumference} ${circumference}`;
        glowEl.style.strokeDashoffset = circumference - (pct * circumference);
    }
}

function updateStats(id, history) {
    if (history.length === 0) return;
    
    const min = Math.min(...history);
    const max = Math.max(...history);
    const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
    
    // Safely update DOM elements if they exist
    const minEl = document.getElementById(`${id}-min`);
    const maxEl = document.getElementById(`${id}-max`);
    const avgEl = document.getElementById(`${id}-avg`);
    
    if(minEl) minEl.innerText = min;
    if(maxEl) maxEl.innerText = max;
    if(avgEl) avgEl.innerText = avg;
}

function updateAQI(mq2, mq135) {
    // Composite Air Quality Index calculation
    const aqi = Math.max(mq2, mq135); 
    
    const scoreEl = document.getElementById('aqi-score');
    if (scoreEl) scoreEl.innerText = aqi;

    const marker = document.getElementById('aqi-marker');
    if (marker) {
        const pct = Math.min((aqi / 1400) * 100, 100);
        marker.style.left = `${pct}%`;
    }
}

function drawSparkline(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    
    const max = 1400;
    data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * canvas.width;
        // Invert Y axis for canvas drawing
        const y = canvas.height - (Math.min(val, max) / max) * canvas.height; 
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

function drawHistoryChart() {
    const canvas = document.getElementById('history-canvas');
    if (!canvas) return;
    
    // Dynamically resize canvas to fit parent container
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = 200; 
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (store.mq2History.length === 0) return;
    
    const maxVal = 1400; 
    const maxPoints = 60;
    const step = canvas.width / (maxPoints - 1);
    
    // Helper function to draw multi-line charts
    function drawLine(data, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        
        const offset = maxPoints - data.length; 
        
        data.forEach((val, i) => {
            const x = (i + offset) * step;
            const y = canvas.height - (Math.min(val, maxVal) / maxVal) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }
    
    drawLine(store.mq135History, '#a78bfa'); // Violet for MQ135
    drawLine(store.mq2History, '#63c8ff');  // Cyan for MQ2
}

function renderRecords() {
    const body = document.getElementById('records-body');
    if (!body || store.records.length === 0) return;

    // Render the latest 10 records into the HTML table structure
    body.innerHTML = store.records.slice(0, 10).map(r => `
        <div style="display:flex; justify-content:space-between; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-family: 'Space Mono', monospace; font-size: 14px;">
            <span style="color: #8892b0;">${new Date(r.ts).toLocaleTimeString()}</span>
            <span style="color: ${r.sensor === 'MQ2' ? '#63c8ff' : '#a78bfa'}; font-weight: bold;">${r.sensor}</span>
            <span style="color: #e2e8f0;">${r.value} ppm</span>
        </div>
    `).join('');
}

function updateSystemStats() {
    const readsEl = document.getElementById('stat-reads');
    if (readsEl) readsEl.innerText = store.totalReads;
    
    const peakEl = document.getElementById('stat-peak');
    const allHistory = [...store.mq2History, ...store.mq135History];
    if (peakEl && allHistory.length > 0) {
        peakEl.innerText = Math.max(...allHistory);
    }
}

function updateUptime() {
    const uptimeEl = document.getElementById('stat-uptime');
    if (!uptimeEl) return;
    
    const diff = Math.floor((Date.now() - store.sessionStart) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    uptimeEl.innerText = `${m}:${s}`;
}

// ── 5. Status & Alert Logic ───────────────────────────────────────────
function checkAlerts(mq2, mq135) {
    const maxVal = Math.max(mq2, mq135);
    let status = 'safe';
    
    // Determine overall system threat level
    if (maxVal >= store.dangerThresh) status = 'danger';
    else if (maxVal >= store.warnThresh) status = 'warn';

    updateStatusUI('mq2', mq2);
    updateStatusUI('mq135', mq135);
    updateAQIStatus(maxVal, status);

    // Fire UI Banners if Alerts are enabled and cooldown has passed
    if (status !== 'safe' && store.alertsEnabled) {
        const now = Date.now();
        if (now - store.lastAlertTime > store.cooldown * 1000) {
            triggerBannerAlert(status, maxVal);
            store.lastAlertTime = now;
            store.alertsFired++;
            
            const statAlerts = document.getElementById('stat-alerts');
            if (statAlerts) statAlerts.innerText = store.alertsFired;
        }
    }
}

function updateStatusUI(id, val) {
    let status = 'safe';
    let text = 'Safe';
    
    if (val >= store.dangerThresh) { status = 'danger'; text = 'Danger'; }
    else if (val >= store.warnThresh) { status = 'warn'; text = 'Warning'; }
    
    const chip = document.getElementById(`chip-${id}`);
    if (chip) {
        chip.className = `chip-value ${status}`;
        chip.innerText = text;
    }
    
    const badge = document.getElementById(`${id}-badge`);
    if (badge) {
        badge.className = `status-badge ${status}`;
        badge.innerText = text.toUpperCase();
    }
}

function updateAQIStatus(maxVal, status) {
    const chip = document.getElementById('chip-aqi');
    const textEl = document.getElementById('aqi-status-text');
    
    let text = 'Good';
    if (status === 'warn') text = 'Moderate';
    if (status === 'danger') text = 'Hazardous';

    if (chip) {
        chip.className = `chip-value ${status}`;
        chip.innerText = text;
    }
    
    if (textEl) {
        textEl.innerText = `Current AQI is ${text} (${maxVal} ppm)`;
        textEl.style.color = status === 'danger' ? '#ef4444' : (status === 'warn' ? '#f59e0b' : '#10b981');
    }
}

function updateHealthBars() {
    // If we haven't received data in 15 seconds, assume sensors are offline
    const isConnected = (Date.now() - store.lastDataTime) < 15000; 
    
    const val1 = isConnected ? Math.floor(Math.random() * 3) + 98 : 0;
    const val2 = isConnected ? Math.floor(Math.random() * 3) + 98 : 0;
    
    const h1 = document.getElementById('mq2-health-pct');
    const b1 = document.getElementById('mq2-health-bar');
    if(h1 && b1) { h1.innerText = val1 + '%'; b1.style.width = val1 + '%'; }
    
    const h2 = document.getElementById('mq135-health-pct');
    const b2 = document.getElementById('mq135-health-bar');
    if(h2 && b2) { h2.innerText = val2 + '%'; b2.style.width = val2 + '%'; }
}

// ── 6. UI Interaction & Modals ────────────────────────────────────────
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navTarget = document.getElementById('nav-' + pageId);
    if (navTarget) navTarget.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const nav = document.getElementById('mobile-nav');
    const ham = document.getElementById('hamburger');
    if (nav) nav.classList.remove('open');
    if (ham) ham.classList.remove('open');
};

window.toggleMobileMenu = function() {
    const nav = document.getElementById('mobile-nav');
    const ham = document.getElementById('hamburger');
    if (nav) nav.classList.toggle('open');
    if (ham) ham.classList.toggle('open');
};

window.openModal = function() {
    const modal = document.getElementById('threshold-modal');
    if (modal) modal.style.display = 'flex'; 
};

window.closeModal = function() {
    const modal = document.getElementById('threshold-modal');
    if (modal) modal.style.display = 'none';
};

window.saveThresholds = function() {
    store.warnThresh = parseInt(document.getElementById('thresh-warn').value) || 400;
    store.dangerThresh = parseInt(document.getElementById('thresh-danger').value) || 1000;
    store.cooldown = parseInt(document.getElementById('thresh-cooldown').value) || 15;
    
    const labels = ['lbl-warn-mq2', 'lbl-danger-mq2', 'lbl-warn-mq135', 'lbl-danger-mq135'];
    labels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = id.includes('warn') ? store.warnThresh : store.dangerThresh;
    });
    
    closeModal();
    showToast('Alert Thresholds Saved Successfully');
    if (activeFSSensor) updateFSView();
};

window.triggerBannerAlert = function(level, val) {
    const banner = document.getElementById('alert-banner');
    const text = document.getElementById('alert-text');
    if (!banner || !text) return;
    
    banner.classList.add('active', level);
    text.innerText = `EMERGENCY: Elevated gas concentration detected (${val} ppm)`;
    
    const badge = document.getElementById('notif-badge');
    if (badge) badge.style.display = 'block';
};

window.closeBanner = function() {
    const banner = document.getElementById('alert-banner');
    if (banner) banner.className = 'alert-banner'; // Reset classes
};

window.toggleAlerts = function() {
    store.alertsEnabled = !store.alertsEnabled;
    showToast(store.alertsEnabled ? 'Notifications Enabled' : 'Notifications Muted');
    
    const badge = document.getElementById('notif-badge');
    if (badge) badge.style.display = 'none';
};

window.exportData = function() {
    if (store.records.length === 0) {
        showToast("No data available to export");
        return;
    }
    
    let csv = "Timestamp,Sensor,Value(ppm)\n";
    store.records.forEach(r => {
        csv += `${new Date(r.ts).toISOString()},${r.sensor},${r.value}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `GasMonitor_Export_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast("Sensor data exported to CSV");
};

window.clearRecords = function() {
    store.records = [];
    const body = document.getElementById('records-body');
    if (body) {
        body.innerHTML = `<div class="records-empty"><i class="fas fa-satellite-dish"></i><p>Waiting for sensor data…</p></div>`;
    }
    showToast("Sensor logs cleared successfully");
};

window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.innerText = message;
    
    // Dynamic styling based on success/error/info
    const bgColor = type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.9)';
    
    toast.style.cssText = `
        background: ${bgColor};
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        margin-top: 10px;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        font-family: 'Space Mono', monospace;
        font-size: 14px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// ── 7. Full Screen Detailed View Logic ──────────────────────────────
window.expandCard = function(sensor) {
    activeFSSensor = sensor;
    const overlay = document.getElementById('fs-overlay');
    
    const title = document.getElementById('fs-title');
    const badge = document.getElementById('fs-badge');
    const icon = document.getElementById('fs-icon');
    
    if (sensor === 'mq2') {
        title.innerText = 'MQ2 Combustibles';
        badge.innerText = 'LPG / SMOKE';
        icon.className = 'fas fa-fire';
        icon.style.color = 'var(--c-cyan)';
    } else {
        title.innerText = 'MQ135 Air Quality';
        badge.innerText = 'GAS / CO2 / NH3';
        icon.className = 'fas fa-wind';
        icon.style.color = 'var(--c-violet)';
    }

    if(overlay) overlay.classList.add('open');
    updateFSView();
};

window.closeFS = function() {
    activeFSSensor = null;
    const overlay = document.getElementById('fs-overlay');
    if(overlay) overlay.classList.remove('open');
};

function updateFSView() {
    if (!activeFSSensor) return;
    
    const currentVal = store[activeFSSensor];
    const history = store[`${activeFSSensor}History`];
    const color = activeFSSensor === 'mq2' ? '#63c8ff' : '#a78bfa';
    
    const valEl = document.getElementById('fs-val');
    if(valEl) valEl.innerText = currentVal;
    
    if (history.length > 0) {
        const minEl = document.getElementById('fs-min');
        const maxEl = document.getElementById('fs-max');
        const avgEl = document.getElementById('fs-avg');
        
        if(minEl) minEl.innerText = Math.min(...history);
        if(maxEl) maxEl.innerText = Math.max(...history);
        if(avgEl) avgEl.innerText = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
    }
    
    let status = 'safe';
    let text = 'SAFE';
    if (currentVal >= store.dangerThresh) { status = 'danger'; text = 'DANGER'; }
    else if (currentVal >= store.warnThresh) { status = 'warn'; text = 'WARNING'; }
    
    const statusEl = document.getElementById('fs-status');
    if(statusEl) {
        statusEl.className = `status-badge ${status}`;
        statusEl.innerText = text;
    }
    
    const canvas = document.getElementById('fs-canvas');
    if (!canvas) return;
    
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 40; 
    canvas.height = rect.height - 40;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (history.length === 0) return;
    
    const maxVal = 1400; 
    const maxPoints = 60;
    const step = canvas.width / (maxPoints - 1);
    const offset = maxPoints - history.length;
    
    // Draw Gradient Area under the chart line
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `${color}44`); 
    gradient.addColorStop(1, `${color}00`); 
    
    ctx.beginPath();
    history.forEach((val, i) => {
        const x = (i + offset) * step;
        const y = canvas.height - (Math.min(val, maxVal) / maxVal) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(offset * step, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the actual Chart Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    
    history.forEach((val, i) => {
        const x = (i + offset) * step;
        const y = canvas.height - (Math.min(val, maxVal) / maxVal) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(x - 2, y - 2, 4, 4);
    });
    ctx.stroke();
    
    // Draw Threshold Warning Lines
    function drawThresh(val, c) {
        const y = canvas.height - (Math.min(val, maxVal) / maxVal) * canvas.height;
        ctx.beginPath();
        ctx.strokeStyle = c;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.setLineDash([]); 
    }
    
    drawThresh(store.warnThresh, 'rgba(251, 191, 36, 0.5)'); 
    drawThresh(store.dangerThresh, 'rgba(248, 113, 113, 0.5)'); 
}

// ── 8. Initialization & Listeners ─────────────────────────────────────
window.addEventListener('resize', () => {
    drawHistoryChart();
    if (activeFSSensor) updateFSView();
});

document.addEventListener('DOMContentLoaded', () => {
    // Start clocks and UI loops
    setInterval(updateUptime, 1000);
    setInterval(updateHealthBars, 5000); 
    
    // Ensure modals are closed on load
    const modal = document.getElementById('threshold-modal');
    if(modal) modal.style.display = 'none';
});