// modules/dashboard.js
function render_dashboard(el) {
  el.innerHTML = `
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Dashboard</span></div>
    <div class="module-header">
      <div class="module-title">🏙️ chandigarh city Overview</div>
      <div class="module-subtitle">Real-time · ${window._currentCity || 'Chandigarh'}</div>
    </div>

    <!-- Stats -->
    <div class="grid-5" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--orange)">
        <div class="stat-label">AQI Index</div>
        <div class="stat-value" style="color:var(--orange)">142</div>
        <div class="stat-sub">PM2.5: 58 µg/m³</div>
        <div class="stat-badge badge-yellow">⚠ MOD</div>
      </div>
      <div class="stat-card" style="--stat-color:var(--green)">
        <div class="stat-label">Power Grid</div>
        <div class="stat-value" style="color:var(--green)">98.2%</div>
        <div class="stat-sub">Load: 847 MW active</div>
        <div class="stat-badge badge-green">✓ STABLE</div>
      </div>
      <div class="stat-card" style="--stat-color:var(--blue)">
        <div class="stat-label">Water Supply</div>
        <div class="stat-value" style="color:var(--blue)">74%</div>
        <div class="stat-sub">2 zones low pressure</div>
        <div class="stat-badge badge-yellow">⚠ CHECK</div>
      </div>
      <div class="stat-card" style="--stat-color:var(--red)">
        <div class="stat-label">Traffic Avg</div>
        <div class="stat-value" style="color:var(--red)">28 km/h</div>
        <div class="stat-sub">3 congestion points</div>
        <div class="stat-badge badge-red">↓ SLOW</div>
      </div>
      <div class="stat-card" style="--stat-color:var(--red)">
        <div class="stat-label">Active Alerts</div>
        <div class="stat-value" style="color:var(--red)">5</div>
        <div class="stat-sub">2 critical · 3 warn</div>
        <div class="stat-badge badge-red">URGENT</div>
      </div>
    </div>

    <!-- Middle row -->
    <div class="grid-3" style="margin-bottom:16px">
      <!-- Quick alerts -->
      <div class="card" style="grid-column:span 2">
        <div class="card-header">
          <span>⚡</span><span class="card-title">Active Alerts</span>
          <span class="chip chip-red" style="margin-left:auto">5 Active</span>
        </div>
        <div class="card-body" style="padding:10px 14px">
          ${[
            {type:'critical',icon:'🚨',title:'Water pipe burst — Sector 22',meta:'EMERGENCY · 14:32 · Municipal team dispatched'},
            {type:'critical',icon:'⚡',title:'Power outage — Sector 18-B',meta:'CRITICAL · 13:15 · ETA: 2 hrs restore'},
            {type:'warn',icon:'🗑️',title:'Waste bin overflow — Sector 43',meta:'WARNING · 12:00 · Collection at 4 PM'},
            {type:'warn',icon:'💨',title:'AQI crossing 150 — Industrial zone',meta:'WARNING · 11:45 · Advisory issued'},
            {type:'info',icon:'🚧',title:'Road diversion — Sector 17-18',meta:'INFO · 09:00 · Until Feb 28'},
          ].map(a=>`
            <div class="alert-item" style="margin-bottom:6px">
              <div class="alert-dot ${a.type==='critical'?'ad-critical':a.type==='warn'?'ad-warn':'ad-info'}"></div>
              <div class="alert-content">
                <div class="at">${a.icon} ${a.title}</div>
                <div class="am">${a.meta}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- City Events quick view -->
      <div class="card">
        <div class="card-header"><span>📅</span><span class="card-title">Upcoming Events</span></div>
        <div class="card-body" style="padding:10px 14px">
          ${[
            {day:'24',mon:'FEB',name:'Rose Festival 2026',place:'Rose Garden, Sec 16'},
            {day:'25',mon:'FEB',name:'Smart City Summit',place:'CIIIT Auditorium'},
            {day:'01',mon:'MAR',name:'Blood Donation Camp',place:'PGI Hospital'},
            {day:'05',mon:'MAR',name:'Holi Cultural Mela',place:'Sector 17 Plaza'},
          ].map(e=>`
            <div style="display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border)">
              <div style="background:var(--blue-bg);border:1px solid var(--blue-bdr);border-radius:7px;padding:5px 9px;text-align:center;min-width:44px">
                <div style="font-size:.58rem;color:var(--text3);font-family:'JetBrains Mono',monospace">${e.mon}</div>
                <div style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:var(--blue)">${e.day}</div>
              </div>
              <div>
                <div style="font-size:.8rem;font-weight:600">${e.name}</div>
                <div style="font-size:.7rem;color:var(--text3)">📍 ${e.place}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid-3">
      <!-- Bus -->
      <div class="card">
        <div class="card-header"><span>🚌</span><span class="card-title">Live Bus Timings</span></div>
        <div class="card-body" style="padding:8px 14px">
          <table class="data-table">
            <thead><tr><th>Route</th><th>Destination</th><th>ETA</th></tr></thead>
            <tbody>
              <tr><td><span class="chip chip-blue">BUS 17</span></td><td>Sec 17 → ISBT</td><td><span style="color:var(--green);font-family:'JetBrains Mono',monospace;font-size:.78rem">3 min</span></td></tr>
              <tr><td><span class="chip chip-green">BUS 22</span></td><td>Mohali → CHD</td><td><span style="color:var(--yellow);font-family:'JetBrains Mono',monospace;font-size:.78rem">8 min</span></td></tr>
              <tr><td><span class="chip chip-orange">BUS 07</span></td><td>PGI → Sec 35</td><td><span style="color:var(--green);font-family:'JetBrains Mono',monospace;font-size:.78rem">2 min</span></td></tr>
              <tr><td><span class="chip chip-red">BUS 31C</span></td><td>Kharar → Airport</td><td><span style="color:var(--red);font-family:'JetBrains Mono',monospace;font-size:.78rem">15 min</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Traffic quick -->
      <div class="card">
        <div class="card-header"><span>🚦</span><span class="card-title">Traffic Status</span></div>
        <div class="card-body">
          ${[
            {road:'Tribune Chowk',pct:90,cls:'p-red',status:'JAM',sc:'var(--red)'},
            {road:'Sector 17 Plaza',pct:75,cls:'p-orange',status:'SLOW',sc:'var(--orange)'},
            {road:'Madhya Marg',pct:50,cls:'p-yellow',status:'MOD',sc:'var(--yellow)'},
            {road:'Dakshin Marg',pct:25,cls:'p-green',status:'FREE',sc:'var(--green)'},
            {road:'PGI Chowk',pct:70,cls:'p-orange',status:'SLOW',sc:'var(--orange)'},
          ].map(r=>`
            <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:.78rem;flex:1;color:var(--text2)">${r.road}</span>
              <div style="width:80px"><div class="progress-wrap"><div class="progress-fill ${r.cls}" style="width:${r.pct}%"></div></div></div>
              <span style="font-family:'JetBrains Mono',monospace;font-size:.65rem;min-width:30px;text-align:right;color:${r.sc}">${r.status}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Quick nav services - Location based -->
      <div class="card">
        <div class="card-header"><span>📍</span><span class="card-title">Nearby Services</span><span id="locBadge" style="margin-left:auto;font-size:.65rem;color:var(--text3)">Finding location...</span></div>
        <div class="card-body" id="nearbyServices">
          <div style="text-align:center;padding:20px;color:var(--text3)">
            <div style="font-size:.8rem">📍 Enabling location access...</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  
  // Get user location and find nearby services
  setTimeout(() => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          document.getElementById('locBadge').textContent = '📍 Based on location';
          updateNearbyServices(userLat, userLng);
        },
        (error) => {
          // Use default Chandigarh center if permission denied
          const defaultLat = 30.7333;
          const defaultLng = 76.7794;
          document.getElementById('locBadge').textContent = '📍 Default location';
          updateNearbyServices(defaultLat, defaultLng);
        }
      );
    }
  }, 100);
}

function updateNearbyServices(userLat, userLng) {
  const nearbyDiv = document.getElementById('nearbyServices');
  nearbyDiv.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text3)">Searching nearby services…</div>`;

  function haversine(lat1, lon1, lat2, lon2){
    const toRad = v => v * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  let radius = 2000; // start 2km
  const maxRadius = 20000; // escalate up to 20km

  (async function search(){
    let elements = [];
    while(radius <= maxRadius){
      const q = `[out:json][timeout:25];(`+
        `node(around:${radius},${userLat},${userLng})[amenity=hospital];`+
        `node(around:${radius},${userLat},${userLng})[amenity=clinic];`+
        `node(around:${radius},${userLat},${userLng})[amenity=police];`+
        `node(around:${radius},${userLat},${userLng})[amenity=fuel];`+
        `node(around:${radius},${userLat},${userLng})[amenity=fire_station];`+
        `node(around:${radius},${userLat},${userLng})[amenity=pharmacy];`+
        `node(around:${radius},${userLat},${userLng})[highway=bus_stop];`+
        `node(around:${radius},${userLat},${userLng})[amenity=bus_station];`+
      `);out center;`;
      try{
        const res = await fetch(overpassUrl, {method:'POST', body:q, headers:{'Content-Type':'text/plain'}});
        if(!res.ok) throw new Error('Overpass error '+res.status);
        const data = await res.json();
        if(data.elements && data.elements.length){
          elements = data.elements.map(e=>({
            id: e.id,
            lat: e.lat || (e.center && e.center.lat),
            lon: e.lon || (e.center && e.center.lon),
            name: e.tags && (e.tags.name || e.tags.ref) || (e.tags && (e.tags.amenity || e.tags.highway)) || 'Unknown',
            type: e.tags && (e.tags.amenity || e.tags.highway || e.tags.public_transport) || 'point'
          })).filter(e=>e.lat && e.lon);
          if(elements.length) break; // use results
        }
      }catch(err){
        console.error('Overpass fetch failed',err);
        break;
      }
      radius *= 2; // expand search
    }

    if(!elements.length){
      nearbyDiv.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text3)"><div style="font-size:.8rem">No nearby services found</div></div>`;
      return;
    }

    elements.forEach(e => e.distance = haversine(userLat, userLng, e.lat, e.lon));
    elements.sort((a,b)=>a.distance - b.distance);
    const nearest = elements.slice(0,6);

    nearbyDiv.innerHTML = `
      <div class="service-grid">
        ${nearest.map(s=>`
          <div class="service-card" onclick="(function(){window._pendingMapLocation={lat:${s.lat},lng:${s.lon},name:${JSON.stringify(s.name)}};loadModule('map');})()" style="cursor:pointer;transition:all .2s">
            <div class="service-icon">${s.type==='bus_stop' || s.type==='bus_station' ? '🚌' : s.type==='hospital' ? '🏥' : s.type==='police' ? '👮' : s.type==='fuel' ? '⛽' : s.type==='fire_station' ? '🚒' : '📍'}</div>
            <div class="service-name">${s.name}</div>
            <div class="service-info">${s.distance.toFixed(1)} km away</div>
          </div>`).join('')}
      </div>`;
  })();
}
