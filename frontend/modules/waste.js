// modules/waste.js
function render_waste(el){
  const zones=[
    {z:'Sector 11',pct:35,trucks:2,last:'9 AM',next:'4 PM',status:'ok'},
    {z:'Sector 17',pct:68,trucks:3,last:'7 AM',next:'2 PM',status:'med'},
    {z:'Sector 22',pct:55,trucks:2,last:'8 AM',next:'3 PM',status:'med'},
    {z:'Sector 35',pct:72,trucks:3,last:'6 AM',next:'1 PM',status:'med'},
    {z:'Sector 43',pct:98,trucks:4,last:'Yesterday',next:'NOW',status:'full'},
    {z:'Industrial Area',pct:28,trucks:5,last:'8 AM',next:'5 PM',status:'ok'},
    {z:'Manimajra',pct:62,trucks:2,last:'7 AM',next:'3 PM',status:'med'},
    {z:'Mohali Ph-1',pct:45,trucks:3,last:'8 AM',next:'4 PM',status:'ok'},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Waste Management</span></div>
    <div class="module-header">
      <div class="module-title">🗑️ Waste Management</div>
      <button class="request-btn" onclick="showWasteRequestDialog()">📝 Report Issue</button>
      <div class="module-subtitle">MC Sanitation · ${window._currentCity||'Chandigarh'}</div>
    </div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Critical Bins</div><div class="stat-value" style="color:var(--red)">1</div><div class="stat-sub">Sector 43 — 98%</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Moderate</div><div class="stat-value" style="color:var(--yellow)">4</div><div class="stat-sub">>60% capacity</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Normal</div><div class="stat-value" style="color:var(--green)">3</div><div class="stat-sub"><40% capacity</div></div>
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Trucks Active</div><div class="stat-value" style="color:var(--blue)">24</div><div class="stat-sub">On collection route</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span>📊</span><span class="card-title">Zone-wise Collection Status</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Zone</th><th>Fill Level</th><th>Trucks</th><th>Last Collection</th><th>Next Collection</th><th>Status</th></tr></thead>
          <tbody>${zones.map(z=>`<tr>
            <td style="font-weight:600">${z.z}</td>
            <td><div style="display:flex;align-items:center;gap:8px"><div class="progress-wrap" style="width:80px;margin:0"><div class="progress-fill ${z.status==='full'?'p-red':z.status==='med'?'p-yellow':'p-green'}" style="width:${z.pct}%"></div></div><span style="font-family:'JetBrains Mono',monospace;font-size:.7rem;color:${z.status==='full'?'var(--red)':z.status==='med'?'var(--yellow)':'var(--green)'}">${z.pct}%</span></div></td>
            <td style="font-family:'JetBrains Mono',monospace">${z.trucks}</td>
            <td style="font-size:.75rem;color:var(--text3)">${z.last}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:${z.next==='NOW'?'var(--red)':'var(--text)'}">${z.next}</td>
            <td><span class="chip ${z.status==='full'?'chip-red':z.status==='med'?'chip-yellow':'chip-green'}">${z.status==='full'?'⚠ OVERFLOW':z.status==='med'?'Moderate':'Good'}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
    <div style="margin-top:16px" class="card">
      <div class="card-header" style="background:linear-gradient(135deg,#f0f7ff,#f5f0ff)"><div class="ai-indicator"></div><span class="card-title" style="color:var(--purple)">🤖 AI Collection Optimization</span></div>
      <div class="card-body"><div class="ai-insight"><span class="ai-arrow">⟩</span>DL anomaly detection flagged unusual disposal patterns in Sector 43 for 3 consecutive days. Recommending permanent bin capacity upgrade from 2T to 4T at this location. Optimized route reduces truck travel by 18%.<div class="ai-tags"><span class="ai-tag tag-dl">DL · ANOMALY DETECT</span><span class="ai-tag tag-ml">ML · ROUTE OPT.</span></div></div></div>
    </div>
  </div>`;
}
