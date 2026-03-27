// modules/aqi.js
function render_aqi(el) {
  el.innerHTML = `
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Air Quality</span></div>
    <div class="module-header">
      <div class="module-title">💨 Air Quality Index</div>
      <button class="request-btn" onclick="showAQIRequestDialog()">📝 Report Issue</button>
      <div class="module-subtitle">CPCB Stations · ${window._currentCity||'Chandigarh'}</div>
    </div>

    <div class="grid-4" style="margin-bottom:16px">
      ${[
        {label:'Overall AQI',val:'142',sub:'Moderate',c:'var(--orange)',s:'--stat-color:var(--orange)'},
        {label:'PM2.5',val:'58',sub:'µg/m³ · High',c:'var(--red)',s:'--stat-color:var(--red)'},
        {label:'PM10',val:'92',sub:'µg/m³ · Moderate',c:'var(--orange)',s:'--stat-color:var(--orange)'},
        {label:'NO₂',val:'24',sub:'ppb · Good',c:'var(--green)',s:'--stat-color:var(--green)'},
      ].map(s=>`
        <div class="stat-card" style="${s.s}">
          <div class="stat-label">${s.label}</div>
          <div class="stat-value" style="color:${s.c}">${s.val}</div>
          <div class="stat-sub">${s.sub}</div>
        </div>`).join('')}
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <!-- Gauge card -->
      <div class="card">
        <div class="card-header"><span>🎯</span><span class="card-title">AQI Gauge — Sector 17 Station</span></div>
        <div class="card-body">
          <div style="text-align:center;font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;color:var(--orange)" id="aqiBig">142</div>
          <div style="text-align:center;font-size:.85rem;color:var(--orange);margin-bottom:14px">⚠ Moderate — Sensitive groups should limit outdoor activity</div>
          <div class="aqi-gauge-track">
            <div class="aqi-pointer" id="aqiPtr" style="left:28%"></div>
          </div>
          <div class="aqi-scale">
            <span>Good<br>0–50</span>
            <span>Moderate<br>51–100</span>
            <span>USG<br>101–150</span>
            <span>Unhealthy<br>151–200</span>
            <span>Very Bad<br>200+</span>
          </div>
          <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${[
              {n:'CO',v:'0.6 ppm',c:'green'},{n:'O₃',v:'38 ppb',c:'green'},
              {n:'SO₂',v:'12 ppb',c:'green'},{n:'Lead',v:'0.01 µg',c:'green'},
            ].map(p=>`
              <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--surface2);border-radius:7px;border:1px solid var(--border)">
                <span style="font-size:.78rem;color:var(--text2)">${p.n}</span>
                <span class="chip chip-${p.c}" style="font-size:.65rem">${p.v}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Station wise -->
      <div class="card">
        <div class="card-header"><span>📍</span><span class="card-title">Station-wise AQI</span></div>
        <div class="card-body" style="padding:8px 14px">
          <table class="data-table">
            <thead><tr><th>Station</th><th>AQI</th><th>PM2.5</th><th>Status</th></tr></thead>
            <tbody>
              ${[
                {sta:'Sector 17',aqi:142,pm:58,s:'Moderate',c:'orange'},
                {sta:'Sector 25 (Ind.)',aqi:168,pm:82,s:'Unhealthy',c:'red'},
                {sta:'Sector 35',aqi:98,pm:42,s:'Moderate',c:'yellow'},
                {sta:'Mohali Ph-1',aqi:78,pm:31,s:'Moderate',c:'yellow'},
                {sta:'Panchkula',aqi:55,pm:22,s:'Good',c:'green'},
                {sta:'Sukhna Lake',aqi:45,pm:18,s:'Good',c:'green'},
              ].map(r=>`<tr>
                <td>${r.sta}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--${r.c})">${r.aqi}</td>
                <td style="font-family:'JetBrains Mono',monospace">${r.pm}</td>
                <td><span class="chip chip-${r.c}">${r.s}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 24h trend -->
    <div class="card">
      <div class="card-header"><span>📈</span><span class="card-title">24-Hour AQI Trend — Sector 17</span></div>
      <div class="card-body">
        <div style="display:flex;align-items:flex-end;gap:4px;height:80px;padding:0 4px">
          ${[88,75,82,90,105,118,130,142,138,125,110,95,100,112,125,140,142,148,142,130,118,105,98,88].map((v,i)=>`
            <div title="${v} AQI at ${i}:00" style="flex:1;height:${(v/150)*100}%;background:${v>150?'var(--red)':v>100?'var(--orange)':v>50?'var(--yellow)':'var(--green)'};border-radius:2px 2px 0 0;opacity:.7;transition:opacity.2s;cursor:pointer" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.7"></div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--text3);margin-top:4px;padding:0 2px">
          ${[0,3,6,9,12,15,18,21,24].map(h=>`<span>${h}:00</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- AI Recommendation -->
    <div style="margin-top:16px" class="card">
      <div class="card-header" style="background:linear-gradient(135deg,#f0f7ff,#f5f0ff)">
        <div class="ai-indicator"></div>
        <span class="card-title" style="color:var(--purple)">🤖 AI Recommendation</span>
      </div>
      <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="ai-insight"><span class="ai-arrow">⟩</span>AQI spike correlates with industrial shift at 2–4 PM. AI suggests staggered industrial schedules could reduce peak pollution by ~23%.<div class="ai-tags"><span class="ai-tag tag-ml">ML · RANDOM FOREST</span></div></div>
        <div class="ai-insight"><span class="ai-arrow">⟩</span>Tomorrow's Rose Festival will increase Sector 16 crowd. AQI may rise to 160 with additional vehicle load. Recommend green corridor activation.<div class="ai-tags"><span class="ai-tag tag-dl">DL · CNN MODEL</span></div></div>
      </div>
    </div>
  </div>`;

  // Animate pointer
  setTimeout(()=>{
    const ptr = document.getElementById('aqiPtr');
    if(ptr) ptr.style.left = '28%';
  }, 300);

  // Simulate fluctuation
  setInterval(()=>{
    const v = 142 + Math.floor(Math.random()*12-6);
    const big = document.getElementById('aqiBig');
    if(big) big.textContent = v;
    const p = document.getElementById('aqiPtr');
    if(p) p.style.left = Math.min(88,Math.max(4,((v-50)/250)*100))+'%';
  }, 4000);
}
