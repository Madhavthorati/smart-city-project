// modules/electricity.js
function render_electricity(el){
  const zones=[
    {z:'Sector 1–10',load:142,cap:200,status:'Normal',outage:false},
    {z:'Sector 11–20',load:188,cap:200,status:'High Load',outage:false},
    {z:'Sector 18-B',load:0,cap:80,status:'OUTAGE',outage:true},
    {z:'Sector 21–35',load:165,cap:220,status:'Normal',outage:false},
    {z:'Industrial Area',load:310,cap:350,status:'Normal',outage:false},
    {z:'Mohali Phase 1',load:98,cap:150,status:'Normal',outage:false},
    {z:'Panchkula Sec 1–10',load:88,cap:150,status:'Normal',outage:false},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Electricity</span></div>
    <div class="module-header"><div class="module-title">⚡ Electricity Grid</div><div class="module-subtitle">PSPCL · ${window._currentCity||'Chandigarh'}</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Grid Uptime</div><div class="stat-value" style="color:var(--green)">98.2%</div><div class="stat-sub">Last 30 days</div></div>
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Total Demand</div><div class="stat-value" style="color:var(--blue)">847 MW</div><div class="stat-sub">Current draw</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Renewables</div><div class="stat-value" style="color:var(--green)">34%</div><div class="stat-sub">Solar + Wind mix</div></div>
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Outages</div><div class="stat-value" style="color:var(--red)">1</div><div class="stat-sub">Sector 18-B · 2hr ETA</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span>🏘️</span><span class="card-title">Zone-wise Load</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Zone</th><th>Load</th><th>Capacity</th><th>Usage</th><th>Status</th></tr></thead>
            <tbody>${zones.map(z=>{const pct=z.outage?0:Math.round((z.load/z.cap)*100);return`<tr>
              <td style="font-weight:600;font-size:.8rem">${z.z}</td>
              <td style="font-family:'JetBrains Mono',monospace">${z.outage?'—':z.load+' MW'}</td>
              <td style="font-family:'JetBrains Mono',monospace;color:var(--text3)">${z.cap} MW</td>
              <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-wrap" style="width:70px;margin:0"><div class="progress-fill ${pct>85?'p-red':pct>70?'p-yellow':'p-green'}" style="width:${pct}%"></div></div><span style="font-size:.65rem;font-family:'JetBrains Mono',monospace">${pct}%</span></div></td>
              <td><span class="chip ${z.outage?'chip-red':pct>85?'chip-yellow':'chip-green'}">${z.status}</span></td>
            </tr>`;}).join('')}</tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>📈</span><span class="card-title">24h Demand Trend</span></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:3px;height:120px">
            ${[340,300,280,290,310,350,420,510,580,620,640,630,610,600,590,610,640,700,780,820,847,810,760,680].map((v,i)=>`<div title="${v} MW at ${i}:00" style="flex:1;height:${(v/900)*100}%;background:${v>800?'var(--red)':v>650?'var(--orange)':v>500?'var(--yellow)':'var(--blue)'};border-radius:2px 2px 0 0;opacity:.7;cursor:pointer" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.7"></div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:.6rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-top:4px">${[0,6,12,18,24].map(h=>`<span>${h}:00</span>`).join('')}</div>
          <div style="margin-top:12px;padding:10px;background:var(--yellow-bg);border:1px solid #fde68a;border-radius:8px;font-size:.78rem;color:var(--yellow)">⚡ Peak demand forecast: <b>7 PM – 9 PM</b> tonight. Load balancing pre-activated at 3 substations.</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header" style="background:linear-gradient(135deg,#f0f7ff,#f5f0ff)"><div class="ai-indicator"></div><span class="card-title" style="color:var(--purple)">🤖 AI Energy Forecast</span></div>
      <div class="card-body"><div class="grid-2"><div class="ai-insight"><span class="ai-arrow">⟩</span>LSTM model predicts +12% demand spike at 7–9 PM. Recommends pre-emptive load balancing from Sector 9 substation to prevent grid stress.<div class="ai-tags"><span class="ai-tag tag-ml">LSTM · TIME SERIES</span></div></div><div class="ai-insight"><span class="ai-arrow">⟩</span>Renewable share can be raised to 38% tomorrow (sunny forecast). Solar generation expected 280 MW from rooftop installations city-wide.<div class="ai-tags"><span class="ai-tag tag-dl">DL · WEATHER FUSION</span></div></div></div></div>
    </div>
  </div>`;
}
