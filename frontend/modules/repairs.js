// modules/repairs.js
function render_repairs(el){
  const items=[
    {road:'Sector 17–18 Connector',type:'Pothole Patching',dept:'PWD',from:'Feb 20',to:'Feb 28',status:'active',impact:'High',divert:'Use Sector 19 bypass'},
    {road:'PGI Flyover Approach',type:'Lane Widening',dept:'PWD',from:'Feb 15',to:'Mar 15',status:'active',impact:'Medium',divert:'Use Service road'},
    {road:'Dakshin Marg (Sec 9–11)',type:'Full Resurfacing',dept:'NHAI',from:'Mar 01',to:'Apr 15',status:'planned',impact:'High',divert:'TBD'},
    {road:'Sector 22 — Main Rd',type:'Drain Cover Fix',dept:'MC',from:'Feb 18',to:'Feb 22',status:'done',impact:'Low',divert:'None needed'},
    {road:'Madhya Marg (Sec 35)',type:'Crack Sealing',dept:'PWD',from:'Feb 24',to:'Feb 26',status:'planned',impact:'Low',divert:'Minor'},
    {road:'Kharar–Mohali NH',type:'Bridge Repair',dept:'NHAI',from:'Mar 10',to:'May 01',status:'planned',impact:'High',divert:'Zirakpur bypass'},
    {road:'Sector 43 Market Rd',type:'Re-carpeting',dept:'MC',from:'Feb 10',to:'Feb 20',status:'done',impact:'Medium',divert:'Side lane'},
  ];
  const statusMap={active:{cls:'chip-orange',label:'Active'},planned:{cls:'chip-yellow',label:'Planned'},done:{cls:'chip-green',label:'Completed'}};
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Road Repairs</span></div>
    <div class="module-header">
      <div class="module-title">🚧 Road Repairs & Maintenance</div>
      <button class="request-btn" onclick="showRepairsRequestDialog()">📝 Report Issue</button>
      <div class="module-subtitle">${window._currentCity||'Chandigarh'}</div>
    </div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--orange)"><div class="stat-label">Active Works</div><div class="stat-value" style="color:var(--orange)">2</div><div class="stat-sub">Currently ongoing</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Planned</div><div class="stat-value" style="color:var(--yellow)">3</div><div class="stat-sub">Starting this month</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Completed</div><div class="stat-value" style="color:var(--green)">2</div><div class="stat-sub">This month</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span>📋</span><span class="card-title">All Road Works</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Road</th><th>Work Type</th><th>Dept</th><th>Period</th><th>Impact</th><th>Diversion</th><th>Status</th></tr></thead>
          <tbody>${items.map(i=>`<tr>
            <td style="font-weight:600;font-size:.8rem">${i.road}</td>
            <td style="font-size:.78rem">${i.type}</td>
            <td><span class="chip chip-blue" style="font-size:.62rem">${i.dept}</span></td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--text3)">${i.from} → ${i.to}</td>
            <td><span class="chip ${i.impact==='High'?'chip-red':i.impact==='Medium'?'chip-yellow':'chip-green'}" style="font-size:.62rem">${i.impact}</span></td>
            <td style="font-size:.72rem;color:var(--text3)">${i.divert}</td>
            <td><span class="chip ${statusMap[i.status].cls}">${statusMap[i.status].label}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
    <div style="margin-top:16px" class="card">
      <div class="card-header" style="background:linear-gradient(135deg,#f0f7ff,#f5f0ff)"><div class="ai-indicator"></div><span class="card-title" style="color:var(--purple)">🤖 AI Maintenance Forecast</span></div>
      <div class="card-body"><div class="ai-insight"><span class="ai-arrow">⟩</span>ML model predicts 14 road sections will require maintenance in March based on sensor data, traffic load, and winter damage patterns. Kharar–Mohali NH junction has 91% probability of pothole formation by mid-March.<div class="ai-tags"><span class="ai-tag tag-ml">ML · REGRESSION</span><span class="ai-tag tag-dl">SENSOR FUSION</span></div></div></div>
    </div>
  </div>`;
}
