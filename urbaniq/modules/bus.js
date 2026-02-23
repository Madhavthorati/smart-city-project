// modules/bus.js
function render_bus(el) {
  const buses = [
    {no:'BUS 17',color:'blue',from:'Sector 17',to:'ISBT Sector 43',eta:3,stops:['Sec 17 Plaza','Sec 22','Sec 34','ISBT'],status:'On Time',cap:45,occ:32},
    {no:'BUS 22',color:'green',from:'Mohali Ph-1',to:'Chandigarh Bus Stand',eta:8,stops:['Mohali Ph-1','Tribune Chowk','Sec 7','Bus Stand'],status:'Delayed 3min',cap:50,occ:48},
    {no:'BUS 07',color:'orange',from:'Panchkula',to:'Sector 35',eta:2,stops:['Panchkula Sec 5','Rock Garden','Sec 22','Sec 35'],status:'On Time',cap:45,occ:20},
    {no:'BUS 31C',color:'red',from:'Kharar',to:'Airport',eta:15,stops:['Kharar','Sec 70','Zirakpur','Airport'],status:'Delayed 10min',cap:45,occ:38},
    {no:'BUS 9',color:'purple',from:'PGIMER',to:'Bus Stand',eta:6,stops:['PGI','Sec 17','Sec 22','Bus Stand'],status:'On Time',cap:50,occ:25},
    {no:'BUS 14',color:'blue',from:'Sector 14',to:'Sector 43',eta:11,stops:['Sec 14','Sec 11','Sec 18','Sec 43'],status:'On Time',cap:45,occ:15},
    {no:'BUS 42',color:'green',from:'Manimajra',to:'Sector 17',eta:18,stops:['Manimajra','Sec 47','Sec 35','Sec 17'],status:'On Time',cap:50,occ:42},
  ];

  el.innerHTML = `
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Bus & Routes</span></div>
    <div class="module-header">
      <div class="module-title">🚌 Bus Timings & Routes</div>
      <div class="module-subtitle">Live tracking · ${window._currentCity||'Chandigarh'}</div>
    </div>

    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Total Routes</div><div class="stat-value" style="color:var(--blue)">24</div><div class="stat-sub">Operating today</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">On Time</div><div class="stat-value" style="color:var(--green)">18</div><div class="stat-sub">75% punctuality</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Delayed</div><div class="stat-value" style="color:var(--yellow)">5</div><div class="stat-sub">Avg delay: 8 min</div></div>
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Out of Service</div><div class="stat-value" style="color:var(--red)">1</div><div class="stat-sub">Maintenance</div></div>
    </div>

    <!-- Tab bar -->
    <div class="tab-bar">
      <button class="tab-btn active" onclick="switchTab(this,'tab-arrivals')">Arrivals</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-routes')">Route Map</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-stops')">Stop Finder</button>
    </div>

    <div id="tab-arrivals" class="tab-panel active">
      <div class="card">
        <div class="card-header"><span>⏱</span><span class="card-title">Next Arrivals — All Stops</span>
          <span style="margin-left:auto;font-size:.7rem;color:var(--text3);font-family:'JetBrains Mono',monospace">Updated just now</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Bus No</th><th>From → To</th><th>ETA</th><th>Stops</th><th>Occupancy</th><th>Status</th></tr></thead>
            <tbody>
              ${buses.map(b=>`<tr>
                <td><span class="chip chip-${b.color}" style="font-family:'JetBrains Mono',monospace;font-weight:700">${b.no}</span></td>
                <td style="font-size:.78rem">${b.from} → ${b.to}</td>
                <td><span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${b.eta<=5?'var(--green)':b.eta<=12?'var(--yellow)':'var(--red)'}">${b.eta} min</span></td>
                <td style="font-size:.72rem;color:var(--text3)">${b.stops.length} stops</td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div class="progress-wrap" style="width:60px;margin:0"><div class="progress-fill ${b.occ/b.cap>0.8?'p-red':b.occ/b.cap>0.6?'p-yellow':'p-green'}" style="width:${(b.occ/b.cap)*100}%"></div></div>
                    <span style="font-size:.65rem;font-family:'JetBrains Mono',monospace">${b.occ}/${b.cap}</span>
                  </div>
                </td>
                <td><span class="chip ${b.status==='On Time'?'chip-green':'chip-yellow'}">${b.status}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="tab-routes" class="tab-panel">
      <div class="card">
        <div class="card-header"><span>🗺️</span><span class="card-title">Route Overview</span></div>
        <div class="card-body">
          ${buses.map(b=>`
            <div style="padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;background:var(--surface2)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                <span class="chip chip-${b.color}" style="font-family:'JetBrains Mono',monospace;font-weight:700">${b.no}</span>
                <span style="font-size:.82rem;font-weight:600">${b.from} → ${b.to}</span>
                <span class="chip ${b.status==='On Time'?'chip-green':'chip-yellow'}" style="margin-left:auto">${b.status}</span>
              </div>
              <div style="display:flex;align-items:center;gap:0">
                ${b.stops.map((s,i)=>`
                  <div style="display:flex;align-items:center">
                    <div style="text-align:center">
                      <div style="width:10px;height:10px;border-radius:50%;background:var(--blue);border:2px solid white;box-shadow:0 0 0 2px var(--blue);margin:0 auto 3px"></div>
                      <div style="font-size:.6rem;color:var(--text3);white-space:nowrap;max-width:70px;overflow:hidden;text-overflow:ellipsis">${s}</div>
                    </div>
                    ${i<b.stops.length-1?`<div style="flex:1;height:2px;background:var(--blue-bdr);min-width:20px;margin-bottom:16px"></div>`:''}
                  </div>
                `).join('')}
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div id="tab-stops" class="tab-panel">
      <div class="card">
        <div class="card-header"><span>📍</span><span class="card-title">Major Bus Stops</span></div>
        <div class="card-body">
          <div class="grid-3">
            ${[
              {name:'ISBT Sector 43',buses:['BUS 17','BUS 9','BUS 22','BUS 7'],next:'3 min'},
              {name:'Sector 17 Plaza',buses:['BUS 17','BUS 22','BUS 9'],next:'2 min'},
              {name:'Tribune Chowk',buses:['BUS 22','BUS 31C'],next:'5 min'},
              {name:'PGI Chowk',buses:['BUS 9','BUS 7'],next:'6 min'},
              {name:'Sector 35',buses:['BUS 7','BUS 14'],next:'8 min'},
              {name:'Rock Garden',buses:['BUS 7','BUS 42'],next:'12 min'},
            ].map(st=>`
              <div class="card" style="margin:0">
                <div class="card-body">
                  <div style="font-weight:600;font-size:.85rem;margin-bottom:6px">📍 ${st.name}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
                    ${st.buses.map(b=>`<span class="chip chip-blue" style="font-size:.62rem">${b}</span>`).join('')}
                  </div>
                  <div style="font-size:.72rem;color:var(--text3)">Next bus: <b style="color:var(--green)">${st.next}</b></div>
                  <button onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(st.name+' Chandigarh')}','_blank')" style="margin-top:8px;width:100%;padding:6px;background:var(--blue-bg);border:1px solid var(--blue-bdr);border-radius:6px;color:var(--blue);font-size:.72rem;cursor:pointer">📍 Navigate</button>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function switchTab(btn, id) {
  const parent = btn.closest('.fade-in') || document;
  parent.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  parent.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('active');
}
