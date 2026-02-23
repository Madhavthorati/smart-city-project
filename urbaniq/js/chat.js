// ================================================
//  Smart City — AI Chat (chat.js)
// ================================================

function toggleChat() {
  document.getElementById('chatDrawer').classList.toggle('open');
}

const aiKB = {
  traffic:     '🚦 Tribune Chowk has heavy jam (90% congestion). AI predicts clearance by 6:30 PM. Use Uttar Marg as alternate.',
  bus:         '🚌 Next from Sector 17: BUS 17 in 3 min, BUS 9 in 6 min. BUS 31C to Kharar delayed 15 min due to road repairs near PGI.',
  aqi:         '💨 AQI is 142 (Moderate). PM2.5 at 58 µg/m³. Sensitive groups should limit outdoor activity till evening.',
  water:       '💧 South zone critically low (22%). Emergency tanker dispatch in progress. Pipe burst at Sector 22 under repair — ETA 2h.',
  electricity: '⚡ Grid uptime 98.2%. Sector 18-B outage since 13:15, ETA restore 2h. Peak load expected 7–9 PM.',
  hospital:    '🏥 Nearest: PGIMER (busy), GMCH Sec 32 (busy), Fortis Mohali (open, shorter wait). Emergency: 108.',
  waste:       '🗑️ Sector 43 bin at 98% — overflow alert. Collection truck at 4 PM. Sectors 11 & Industrial under 35%.',
  event:       '📅 Rose Festival tomorrow (Feb 24) at Rose Garden Sec 16, 9AM–6PM. Smart City Summit Feb 25, CIIIT.',
  repair:      '🚧 Active: Sec 17-18 connector (until Feb 28), PGI Flyover approach (until Mar 15). Planned: Dakshin Marg from Mar 1.',
  municipal:   '🏛️ MC Helpline: 1800-XXX-XXXX. Online portal open for property tax, grievances & building permissions.',
  police:      '👮 Police Control Room: 100. Nearest station: Sector 17 Police Station, 0.8 km away.',
  emergency:   '🚨 Active incident — Water burst Sector 22. Emergency contacts: Police 100, Fire 101, Ambulance 108.',
};

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const msgs = document.getElementById('chatMessages');

  // User bubble
  const u = document.createElement('div');
  u.className = 'chat-msg user';
  u.textContent = msg;
  msgs.appendChild(u);
  input.value = '';

  // Thinking indicator
  const think = document.createElement('div');
  think.className = 'chat-msg ai';
  think.innerHTML = '<div class="thinking-dots"><div class="think-dot"></div><div class="think-dot"></div><div class="think-dot"></div></div>';
  msgs.appendChild(think);
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    think.remove();
    const lm = msg.toLowerCase();
    let resp = '🤖 I can help with traffic, buses, AQI, water, electricity, hospitals, waste, events, and repairs. Could you be more specific?';

    for (const [key, ans] of Object.entries(aiKB)) {
      if (lm.includes(key) || (key === 'bus' && lm.includes('route')) ||
          (key === 'electricity' && (lm.includes('power') || lm.includes('outage'))) ||
          (key === 'hospital' && lm.includes('doctor')) ||
          (key === 'event' && lm.includes('festival')) ||
          (key === 'water' && lm.includes('supply'))) {
        resp = ans;
        break;
      }
    }

    const ai = document.createElement('div');
    ai.className = 'chat-msg ai';
    ai.textContent = resp;
    msgs.appendChild(ai);
    msgs.scrollTop = msgs.scrollHeight;
  }, 900);
}
