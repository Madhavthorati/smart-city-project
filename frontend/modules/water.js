// modules/water.js
function render_water(el){
  const zones=[
    {name:'North',pct:82,pressure:'Good',supply:'6h/day',issue:''},
    {name:'Central',pct:38,pressure:'Low',supply:'4h/day',issue:'Partial restriction'},
    {name:'East',pct:74,pressure:'Normal',supply:'6h/day',issue:''},
    {name:'South',pct:22,pressure:'Critical',supply:'2h/day',issue:'Pipe burst repair'},
    {name:'West',pct:90,pressure:'Good',supply:'6h/day',issue:''},
    {name:'Industrial',pct:65,pressure:'Normal',supply:'8h/day',issue:''},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Water Supply</span></div>
    <div class="module-header">
      <div class="module-title">💧 Water Supply Monitoring</div>
      <button class="request-btn" onclick="showWaterRequestDialog()">📝 Report Issue</button>
      <div class="module-subtitle">MC Water Works · ${window._currentCity||'Chandigarh'}</div>
    </div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Avg Reservoir</div><div class="stat-value" style="color:var(--blue)">62%</div><div class="stat-sub">City-wide average</div></div>
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Critical Zones</div><div class="stat-value" style="color:var(--red)">2</div><div class="stat-sub">South & Central</div></div>
      <div class="stat-card" style="--stat-color:var(--orange)"><div class="stat-label">Active Leaks</div><div class="stat-value" style="color:var(--orange)">1</div><div class="stat-sub">Sector 22 burst</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Tankers Deployed</div><div class="stat-value" style="color:var(--green)">4</div><div class="stat-sub">To South zone</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span>🏗️</span><span class="card-title">Zone Reservoir Levels</span></div>
        <div class="card-body">
          <div class="water-zones">
            ${zones.map(z=>`<div class="wz">
              <div class="wz-track"><div class="wz-fill ${z.pct<30?'p-red':z.pct<60?'p-yellow':'p-blue'}" style="height:${z.pct}%"></div></div>
              <div class="wz-label">${z.name}</div>
              <div class="wz-pct" style="color:${z.pct<30?'var(--red)':z.pct<60?'var(--yellow)':'var(--blue)'}">${z.pct}%</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>📋</span><span class="card-title">Zone Details</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Zone</th><th>Level</th><th>Pressure</th><th>Supply</th><th>Issue</th></tr></thead>
            <tbody>${zones.map(z=>`<tr>
              <td style="font-weight:600">${z.name}</td>
              <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-wrap" style="width:55px;margin:0"><div class="progress-fill ${z.pct<30?'p-red':z.pct<60?'p-yellow':'p-blue'}" style="width:${z.pct}%"></div></div><span style="font-family:'JetBrains Mono',monospace;font-size:.65rem">${z.pct}%</span></div></td>
              <td><span class="chip ${z.pressure==='Critical'?'chip-red':z.pressure==='Low'?'chip-yellow':'chip-green'}">${z.pressure}</span></td>
              <td style="font-family:'JetBrains Mono',monospace;font-size:.75rem">${z.supply}</td>
              <td style="font-size:.72rem;color:var(--text3)">${z.issue||'—'}</td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card" style="border-color:var(--red)">
      <div class="card-header" style="background:var(--red-bg)"><span>🚨</span><span class="card-title" style="color:var(--red)">Active Incident — Sector 22 Pipe Burst</span></div>
      <div class="card-body"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:.82rem">
        <div><div style="color:var(--text3);font-size:.7rem;margin-bottom:4px">REPORTED AT</div><b>14:32 today</b></div>
        <div><div style="color:var(--text3);font-size:.7rem;margin-bottom:4px">TEAM STATUS</div><span class="chip chip-orange">En Route</span></div>
        <div><div style="color:var(--text3);font-size:.7rem;margin-bottom:4px">ETA RESTORE</div><b style="color:var(--orange)">~16:30</b></div>
        <div><div style="color:var(--text3);font-size:.7rem;margin-bottom:4px">AFFECTED</div><b>Sec 22, 23 residents</b></div>
        <div><div style="color:var(--text3);font-size:.7rem;margin-bottom:4px">TANKERS</div><b style="color:var(--blue)">2 dispatched</b></div>
        <div><div style="color:var(--text3);font-size:.7rem;margin-bottom:4px">HELPLINE</div><b>1916</b></div>
      </div></div>
    </div>
  </div>`;
}
