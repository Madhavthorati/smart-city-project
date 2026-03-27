// modules/traffic.js
function render_traffic(el){
  const roads=[
    {name:'Tribune Chowk',speed:8,pct:90,status:'JAM',color:'red',inc:'Accident at signal — clearance by 6:30 PM'},
    {name:'Sector 17 Plaza',speed:18,pct:75,status:'SLOW',color:'orange',inc:'Heavy festival parking'},
    {name:'Madhya Marg (Sec 9–22)',speed:28,pct:50,status:'MOD',color:'yellow',inc:''},
    {name:'Dakshin Marg',speed:46,pct:25,status:'FREE',color:'green',inc:''},
    {name:'Uttar Marg',speed:35,pct:42,status:'MOD',color:'yellow',inc:''},
    {name:'PGI Chowk',speed:15,pct:70,status:'SLOW',color:'orange',inc:'OPD peak hours'},
    {name:'Zirakpur Flyover',speed:22,pct:60,status:'MOD',color:'yellow',inc:''},
    {name:'Airport Road',speed:55,pct:18,status:'FREE',color:'green',inc:''},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Traffic</span></div>
    <div class="module-header">
      <div class="module-title">🚦 Traffic Status</div>
      <button class="request-btn" onclick="showTrafficRequestDialog()">📝 Report Issue</button>
      <div class="module-subtitle">Real-time · ${window._currentCity||'Chandigarh'}</div>
    </div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Avg City Speed</div><div class="stat-value" style="color:var(--red)">28</div><div class="stat-sub">km/h · Below normal</div></div>
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Jam Points</div><div class="stat-value" style="color:var(--red)">3</div><div class="stat-sub">Tribune, PGI, Sec17</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Diversions</div><div class="stat-value" style="color:var(--yellow)">2</div><div class="stat-sub">Active reroutes</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Clear Roads</div><div class="stat-value" style="color:var(--green)">5</div><div class="stat-sub">Free-flow corridors</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span>🗺️</span><span class="card-title">Road-by-Road Status</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Road</th><th>Speed</th><th>Congestion</th><th>Status</th><th>Incident</th></tr></thead>
          <tbody>${roads.map(r=>`<tr>
            <td style="font-weight:600">${r.name}</td>
            <td style="font-family:'JetBrains Mono',monospace;color:var(--${r.color})">${r.speed} km/h</td>
            <td style="min-width:120px"><div style="display:flex;align-items:center;gap:8px"><div class="progress-wrap" style="flex:1;margin:0"><div class="progress-fill p-${r.color}" style="width:${r.pct}%"></div></div><span style="font-family:'JetBrains Mono',monospace;font-size:.65rem">${r.pct}%</span></div></td>
            <td><span class="chip chip-${r.color}">${r.status}</span></td>
            <td style="font-size:.75rem;color:var(--text3)">${r.inc||'—'}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
    <div style="margin-top:16px" class="card">
      <div class="card-header" style="background:linear-gradient(135deg,#f0f7ff,#f5f0ff)"><div class="ai-indicator"></div><span class="card-title" style="color:var(--purple)">🤖 AI Traffic Prediction</span></div>
      <div class="card-body"><div class="grid-2"><div class="ai-insight"><span class="ai-arrow">⟩</span>Tribune Chowk jam predicted to clear by <b>6:30 PM</b> based on historical 87% pattern match. Route via Uttar Marg saves ~14 min.<div class="ai-tags"><span class="ai-tag tag-ml">ML · GRADIENT BOOST</span></div></div><div class="ai-insight"><span class="ai-arrow">⟩</span>Rose Festival tomorrow (Sec 16) expected to add 15,000+ visitors. Recommend deploying traffic marshals at Sector 15–16 junction from 8 AM.<div class="ai-tags"><span class="ai-tag tag-dl">DL · CROWD MODEL</span></div></div></div></div>
    </div>
  </div>`;
}
