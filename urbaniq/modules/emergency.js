// modules/emergency.js
function render_emergency(el){
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Emergency</span></div>
    <div class="module-header"><div class="module-title">🚨 Emergency Services</div><div class="module-subtitle">${window._currentCity||'Chandigarh'}</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--red);cursor:pointer" onclick="window.open('tel:100')"><div class="stat-label">Police</div><div class="stat-value" style="color:var(--red)">100</div><div class="stat-sub">Control Room</div></div>
      <div class="stat-card" style="--stat-color:var(--orange);cursor:pointer" onclick="window.open('tel:101')"><div class="stat-label">Fire Brigade</div><div class="stat-value" style="color:var(--orange)">101</div><div class="stat-sub">Nearest: 2.1 km</div></div>
      <div class="stat-card" style="--stat-color:var(--blue);cursor:pointer" onclick="window.open('tel:108')"><div class="stat-label">Ambulance</div><div class="stat-value" style="color:var(--blue)">108</div><div class="stat-sub">24/7 Available</div></div>
      <div class="stat-card" style="--stat-color:var(--purple);cursor:pointer" onclick="window.open('tel:112')"><div class="stat-label">Helpline</div><div class="stat-value" style="color:var(--purple)">112</div><div class="stat-sub">National Emergency</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card" style="border-color:var(--red)">
        <div class="card-header" style="background:var(--red-bg)"><span>🔴</span><span class="card-title" style="color:var(--red)">Active Incidents</span></div>
        <div class="card-body">
          ${[
            {type:'Water Burst',loc:'Sector 22',time:'14:32',resp:'Municipal Team',eta:'2h'},
            {type:'Power Outage',loc:'Sector 18-B',time:'13:15',resp:'PSPCL Team',eta:'45 min'},
          ].map(i=>`
            <div class="alert-item" style="border-color:var(--red);background:var(--red-bg)">
              <div class="alert-dot ad-critical"></div>
              <div class="alert-content">
                <div class="at">🚨 ${i.type} — ${i.loc}</div>
                <div class="am">Reported: ${i.time} · Team: ${i.resp} · ETA: ${i.eta}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>📍</span><span class="card-title">Emergency Stations Nearby</span></div>
        <div class="card-body">
          <div class="service-grid">
            ${[
              {icon:'👮',name:'Police Sec 17',dist:'0.8 km',url:'Sector 17 Police Station Chandigarh'},
              {icon:'👮',name:'Police Sec 26',dist:'1.4 km',url:'Sector 26 Police Station Chandigarh'},
              {icon:'🚒',name:'Fire Station',dist:'2.1 km',url:'Fire Station Chandigarh'},
              {icon:'🚑',name:'GMCH Sec 32',dist:'1.9 km',url:'GMCH Chandigarh'},
              {icon:'🏥',name:'PGIMER',dist:'2.4 km',url:'PGIMER Chandigarh'},
              {icon:'🏦',name:'Blood Bank',dist:'2.6 km',url:'Blood Bank Chandigarh'},
            ].map(s=>`<div class="service-card" onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(s.url)}','_blank')"><div class="service-icon">${s.icon}</div><div class="service-name">${s.name}</div><div class="service-info">${s.dist}</div></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// modules/hospitals.js
function render_hospitals(el){
  const hosps=[
    {name:'PGIMER',type:'Government',spec:'Multi-specialty',beds:2000,avail:200,wait:'45 min',status:'busy',loc:'Sector 12'},
    {name:'GMCH Sector 32',type:'Government',spec:'Multi-specialty',beds:1000,avail:120,wait:'30 min',status:'busy',loc:'Sector 32'},
    {name:'Fortis Hospital',type:'Private',spec:'Cardiology, Ortho',beds:250,avail:45,wait:'15 min',status:'open',loc:'Mohali'},
    {name:'Max Hospital',type:'Private',spec:'Multi-specialty',beds:200,avail:38,wait:'10 min',status:'open',loc:'Phase 6 Mohali'},
    {name:'GMSH Sector 16',type:'Government',spec:'General',beds:300,avail:60,wait:'20 min',status:'open',loc:'Sector 16'},
    {name:'Ivy Hospital',type:'Private',spec:'Neuro, Ortho',beds:180,avail:30,wait:'10 min',status:'open',loc:'Sector 71'},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Hospitals</span></div>
    <div class="module-header"><div class="module-title">🏥 Hospitals</div><div class="module-subtitle">${window._currentCity||'Chandigarh'} · Tricity</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Total Hospitals</div><div class="stat-value" style="color:var(--blue)">18</div><div class="stat-sub">Govt + Private</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Available Beds</div><div class="stat-value" style="color:var(--green)">493</div><div class="stat-sub">Out of 3930</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Busy</div><div class="stat-value" style="color:var(--yellow)">2</div><div class="stat-sub">High occupancy</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Ambulances</div><div class="stat-value" style="color:var(--green)">108</div><div class="stat-sub">Call anytime</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span>🏥</span><span class="card-title">Hospital Directory</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Hospital</th><th>Type</th><th>Location</th><th>Speciality</th><th>Available Beds</th><th>Wait</th><th>Status</th><th></th></tr></thead>
          <tbody>${hosps.map(h=>`<tr>
            <td style="font-weight:600">${h.name}</td>
            <td><span class="chip ${h.type==='Government'?'chip-blue':'chip-purple'}" style="font-size:.62rem">${h.type}</span></td>
            <td style="font-size:.75rem;color:var(--text3)">${h.loc}</td>
            <td style="font-size:.75rem">${h.spec}</td>
            <td style="font-family:'JetBrains Mono',monospace">${h.avail} / ${h.beds}</td>
            <td style="font-family:'JetBrains Mono',monospace;color:var(--text2)">${h.wait}</td>
            <td><span class="chip ${h.status==='busy'?'chip-yellow':'chip-green'}">${h.status==='busy'?'Busy':'Open'}</span></td>
            <td><button onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(h.name+' '+h.loc)}','_blank')" style="padding:4px 10px;background:var(--blue-bg);border:1px solid var(--blue-bdr);border-radius:5px;color:var(--blue);font-size:.7rem;cursor:pointer">📍 Map</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>`;
}

// modules/schools.js
function render_schools(el){
  const schls=[
    {name:'Govt. Model Sr. Sec. School Sec 16',type:'School',affil:'CBSE',std:'6–12',status:'Open',loc:'Sector 16'},
    {name:'Bhavan Vidyalaya',type:'School',affil:'CBSE',std:'1–12',status:'Open',loc:'Sector 15'},
    {name:"St. John's High School",type:'School',affil:'ICSE',std:'1–12',status:'Open',loc:'Sector 26'},
    {name:'Panjab University',type:'University',affil:'UGC',std:'UG/PG',status:'Open',loc:'Sector 14'},
    {name:'Chandigarh University',type:'University',affil:'NAAC A+',std:'UG/PG/PhD',status:'Open',loc:'Gharuan'},
    {name:'UIET, Sector 25',type:'College',affil:'PU',std:'B.Tech/M.Tech',status:'Exam Mode',loc:'Sector 25'},
    {name:'Govt. College Sector 11',type:'College',affil:'PU',std:'UG',status:'Open',loc:'Sector 11'},
    {name:'Punjab Engineering College',type:'College',affil:'Deemed Univ',std:'B.Tech/M.Tech',status:'Open',loc:'Sector 12'},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Schools & Colleges</span></div>
    <div class="module-header"><div class="module-title">🏫 Schools & Colleges</div><div class="module-subtitle">${window._currentCity||'Chandigarh'}</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Schools</div><div class="stat-value" style="color:var(--blue)">124</div><div class="stat-sub">Govt + Private</div></div>
      <div class="stat-card" style="--stat-color:var(--purple)"><div class="stat-label">Colleges</div><div class="stat-value" style="color:var(--purple)">38</div><div class="stat-sub">All streams</div></div>
      <div class="stat-card" style="--stat-color:var(--teal)"><div class="stat-label">Universities</div><div class="stat-value" style="color:var(--teal)">5</div><div class="stat-sub">In tricity</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Open Today</div><div class="stat-value" style="color:var(--green)">96%</div><div class="stat-sub">Normal schedule</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span>🎓</span><span class="card-title">Institutions Directory</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Institution</th><th>Type</th><th>Affiliation</th><th>Level</th><th>Location</th><th>Status</th><th></th></tr></thead>
          <tbody>${schls.map(s=>`<tr>
            <td style="font-weight:600;font-size:.8rem">${s.name}</td>
            <td><span class="chip ${s.type==='University'?'chip-purple':s.type==='College'?'chip-blue':'chip-teal'}" style="font-size:.62rem">${s.type}</span></td>
            <td style="font-size:.72rem;color:var(--text3)">${s.affil}</td>
            <td style="font-size:.75rem">${s.std}</td>
            <td style="font-size:.72rem;color:var(--text3)">${s.loc}</td>
            <td><span class="chip ${s.status==='Open'?'chip-green':'chip-yellow'}">${s.status}</span></td>
            <td><button onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(s.name)}','_blank')" style="padding:4px 10px;background:var(--blue-bg);border:1px solid var(--blue-bdr);border-radius:5px;color:var(--blue);font-size:.7rem;cursor:pointer">📍 Map</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>`;
}

// modules/municipal.js
function render_municipal(el){
  const services=[
    {icon:'📋',name:'Property Tax Payment',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'🔧',name:'Grievance Portal',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'🏗️',name:'Building Permissions',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'💡',name:'Street Light Complaint',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'🌊',name:'Sewage / Drainage',status:'Call 1916',url:'tel:1916'},
    {icon:'🗑️',name:'Sanitation Complaint',status:'Call 1800',url:'tel:1800'},
    {icon:'🛣️',name:'Road Repair Request',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'🌳',name:'Parks & Horticulture',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'📜',name:'Birth / Death Certificate',status:'Online',url:'https://www.mcchandigarh.gov.in'},
    {icon:'🏪',name:'Trade License',status:'Online',url:'https://www.mcchandigarh.gov.in'},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Municipal Corporation</span></div>
    <div class="module-header"><div class="module-title">🏛️ Municipal Corporation</div><div class="module-subtitle">MC ${window._currentCity||'Chandigarh'}</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Open Services</div><div class="stat-value" style="color:var(--blue)">12</div><div class="stat-sub">Online + Walk-in</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Pending Requests</div><div class="stat-value" style="color:var(--yellow)">348</div><div class="stat-sub">Grievances in queue</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Resolved Today</div><div class="stat-value" style="color:var(--green)">52</div><div class="stat-sub">Grievances closed</div></div>
      <div class="stat-card" style="--stat-color:var(--purple)"><div class="stat-label">Helpline</div><div class="stat-value" style="color:var(--purple)">1800</div><div class="stat-sub">Mon–Sat 9AM–5PM</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span>🛎️</span><span class="card-title">Citizen Services</span></div>
        <div class="card-body">
          ${services.map(s=>`
            <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="window.open('${s.url}','_blank')" onmouseover="this.style.background='var(--bg2)'" onmouseout="this.style.background=''">
              <span style="font-size:1.2rem;width:26px;text-align:center">${s.icon}</span>
              <span style="flex:1;font-size:.82rem">${s.name}</span>
              <span class="chip chip-green" style="font-size:.62rem">${s.status}</span>
              <span style="color:var(--blue);font-size:.8rem">→</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>📊</span><span class="card-title">Department Contacts</span></div>
        <div class="card-body">
          ${[
            {dept:'Commissioner Office',phone:'0172-2700611',hours:'9–5'},
            {dept:'Water Works Div.',phone:'1916',hours:'24/7'},
            {dept:'Health & Sanitation',phone:'0172-2700890',hours:'9–5'},
            {dept:'Engineering (Roads)',phone:'0172-2701018',hours:'9–5'},
            {dept:'Revenue Dept.',phone:'0172-2701023',hours:'9–5'},
            {dept:'Fire Services',phone:'101',hours:'24/7'},
            {dept:'Complaints Cell',phone:'1800-XXX-XXXX',hours:'9–5'},
          ].map(d=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
              <span style="flex:1;font-size:.8rem">${d.dept}</span>
              <a href="tel:${d.phone}" style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--blue);text-decoration:none">${d.phone}</a>
              <span class="chip chip-green" style="font-size:.6rem">${d.hours}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

// modules/events.js
function render_events(el){
  const events=[
    {day:'24',mon:'FEB',name:'Rose Festival 2026',place:'Rose Garden, Sector 16',time:'9:00 AM – 6:00 PM',cat:'Culture',impact:'High',note:'Extra buses on Routes 7 & 17. Parking at Sec 17.'},
    {day:'25',mon:'FEB',name:'Smart City Summit',place:'CIIIT Auditorium, Sec 20',time:'10:00 AM – 5:00 PM',cat:'Tech',impact:'Low',note:'Registration required.'},
    {day:'01',mon:'MAR',name:'Blood Donation Camp',place:'PGI Hospital, Sec 12',time:'8:00 AM – 2:00 PM',cat:'Health',impact:'Low',note:'Open for all blood groups.'},
    {day:'05',mon:'MAR',name:'Holi Cultural Mela',place:'Sector 17 Plaza',time:'7:00 PM – 11:00 PM',cat:'Festival',impact:'High',note:'Traffic diversions around Sec 17. Extra police deployed.'},
    {day:'10',mon:'MAR',name:'Chandigarh Marathon',place:'Sector 17 – Sukhna Lake',time:'6:00 AM – 10:00 AM',cat:'Sports',impact:'High',note:'Madhya Marg closed 6–10 AM for runners.'},
    {day:'15',mon:'MAR',name:'Literary Festival',place:'Tagore Theatre, Sec 18',time:'11:00 AM – 8:00 PM',cat:'Culture',impact:'Medium',note:'Parking at Sector 19 ground.'},
  ];
  const catColor={Culture:'blue',Tech:'purple',Health:'green',Festival:'orange',Sports:'teal',Education:'blue'};
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>City Events</span></div>
    <div class="module-header"><div class="module-title">📅 City Events</div><div class="module-subtitle">${window._currentCity||'Chandigarh'} · Feb–Mar 2026</div></div>
    <div class="grid-3" style="gap:14px">
      ${events.map(e=>`
        <div class="card" style="margin:0">
          <div class="card-header" style="background:var(--${catColor[e.cat]||'blue'}-bg)">
            <span class="chip chip-${catColor[e.cat]||'blue'}" style="font-size:.65rem">${e.cat}</span>
            <span class="chip ${e.impact==='High'?'chip-orange':e.impact==='Medium'?'chip-yellow':'chip-green'}" style="font-size:.62rem;margin-left:auto">Impact: ${e.impact}</span>
          </div>
          <div class="card-body">
            <div style="display:flex;gap:10px;margin-bottom:10px">
              <div style="background:var(--${catColor[e.cat]||'blue'}-bg);border:1px solid var(--${catColor[e.cat]||'blue'}-bdr,var(--border));border-radius:8px;padding:6px 10px;text-align:center;min-width:50px">
                <div style="font-size:.6rem;color:var(--text3);font-family:'JetBrains Mono',monospace">${e.mon}</div>
                <div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--${catColor[e.cat]||'blue'})">${e.day}</div>
              </div>
              <div>
                <div style="font-weight:700;font-size:.88rem;margin-bottom:3px">${e.name}</div>
                <div style="font-size:.72rem;color:var(--text3)">📍 ${e.place}</div>
                <div style="font-size:.72rem;color:var(--text3)">⏰ ${e.time}</div>
              </div>
            </div>
            <div style="background:var(--bg2);border-radius:6px;padding:8px;font-size:.75rem;color:var(--text2)">ℹ ${e.note}</div>
            <button onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(e.place)}','_blank')" style="margin-top:8px;width:100%;padding:6px;background:var(--blue-bg);border:1px solid var(--blue-bdr);border-radius:6px;color:var(--blue);font-size:.72rem;cursor:pointer">📍 Navigate to Venue</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

// modules/alerts.js
function render_alerts(el){
  const alerts=[
    {sev:'critical',icon:'🚨',title:'Water pipe burst — Sector 22',meta:'EMERGENCY · 14:32 · Municipal team dispatched',detail:'Main pipeline rupture at junction 14-B near Sector 22 market. Water supply affected in ~800 households. Tankers deployed.'},
    {sev:'critical',icon:'⚡',title:'Power outage — Sector 18-B',meta:'CRITICAL · 13:15 · PSPCL team on site',detail:'Transformer fault at Sector 18-B substation. ~1200 households affected. Estimated restore time: 16:00.'},
    {sev:'warn',icon:'🗑️',title:'Waste bin overflow — Sector 43',meta:'WARNING · 12:00 · Collection at 4 PM',detail:'Waste bin at Sector 43 market reached 98% capacity. Collection truck rerouted. Residents requested to use temporary bins placed at entry.'},
    {sev:'warn',icon:'💨',title:'AQI crossing 150 — Industrial Area',meta:'WARNING · 11:45 · Advisory issued',detail:'PM2.5 levels elevated at industrial zone monitoring station. Factories advised to reduce emissions during 2–4 PM shift. Residents advised to stay indoors.'},
    {sev:'info',icon:'🚧',title:'Road diversion — Sector 17-18 Connector',meta:'INFO · 09:00 · Until Feb 28',detail:'PWD pothole repair works ongoing on Sector 17-18 connector road. Use Sector 19 road as alternate. Expected completion: Feb 28.'},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Alerts</span></div>
    <div class="module-header"><div class="module-title">⚡ City Alerts</div><div class="module-subtitle">${window._currentCity||'Chandigarh'} · Live</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Critical</div><div class="stat-value" style="color:var(--red)">2</div><div class="stat-sub">Immediate action</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Warnings</div><div class="stat-value" style="color:var(--yellow)">2</div><div class="stat-sub">Monitor closely</div></div>
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Info</div><div class="stat-value" style="color:var(--blue)">1</div><div class="stat-sub">FYI updates</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Resolved Today</div><div class="stat-value" style="color:var(--green)">8</div><div class="stat-sub">Closed incidents</div></div>
    </div>
    ${alerts.map(a=>`
      <div class="alert-item" style="margin-bottom:10px;border-left:4px solid ${a.sev==='critical'?'var(--red)':a.sev==='warn'?'var(--yellow)':'var(--blue)'}">
        <div class="alert-dot ${a.sev==='critical'?'ad-critical':a.sev==='warn'?'ad-warn':'ad-info'}"></div>
        <div class="alert-content" style="flex:1">
          <div class="at">${a.icon} ${a.title}</div>
          <div class="am" style="margin-bottom:6px">${a.meta}</div>
          <div style="font-size:.78rem;color:var(--text2);background:var(--surface2);padding:8px 10px;border-radius:6px;border:1px solid var(--border)">${a.detail}</div>
        </div>
      </div>`).join('')}
  </div>`;
}

// modules/ai.js
function render_ai(el){
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>AI Analysis</span></div>
    <div class="module-header"><div class="module-title">🤖 AI Urban Intelligence</div><div class="module-subtitle">ML · DL · LLM · ${window._currentCity||'Chandigarh'}</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--purple)"><div class="stat-label">ML Models</div><div class="stat-value" style="color:var(--purple)">8</div><div class="stat-sub">Active predictors</div></div>
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Data Points</div><div class="stat-value" style="color:var(--blue)">2.4M</div><div class="stat-sub">Processed today</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Avg Accuracy</div><div class="stat-value" style="color:var(--green)">91%</div><div class="stat-sub">Across all models</div></div>
      <div class="stat-card" style="--stat-color:var(--teal)"><div class="stat-label">LLM Queries</div><div class="stat-value" style="color:var(--teal)">1,284</div><div class="stat-sub">Processed today</div></div>
    </div>
    <div class="grid-3" style="margin-bottom:16px">
      ${[
        {icon:'🚦',title:'Traffic Prediction',model:'Gradient Boosting · 87% acc',insight:'Tribune Chowk jam clears by 6:30 PM. Uttar Marg saves 14 min.',tag:'traffic',tagc:'tag-traffic'},
        {icon:'🗑️',title:'Waste Overflow Alert',model:'DL Anomaly Detection · 93% acc',insight:'Sector 43 bin overflow imminent at 16:00. Irregular disposal pattern for 3 days.',tag:'DL',tagc:'tag-dl'},
        {icon:'⚡',title:'Energy Demand Forecast',model:'LSTM Time Series · 91% acc',insight:'+12% demand spike forecast at 7–9 PM. Pre-emptive load balancing recommended.',tag:'LSTM',tagc:'tag-energy'},
        {icon:'💧',title:'Water Leak Detection',model:'LLM + Sensor Fusion · 89% acc',insight:'Pipeline pressure anomaly at Sector 22 junction 14-B signals probable leak.',tag:'LLM',tagc:'tag-water'},
        {icon:'💨',title:'AQI Prediction',model:'Random Forest · 88% acc',insight:'Industrial shift correlation with AQI spike. Staggered schedule reduces peak by 23%.',tag:'RF',tagc:'tag-ml'},
        {icon:'🎪',title:'Event Impact Model',model:'NLP + Crowd Sim · 85% acc',insight:'Rose Festival adds 15K visitors to Sec 16. Recommend 3 extra buses on Routes 7 & 17.',tag:'NLP',tagc:'tag-llm'},
      ].map(i=>`
        <div class="card" style="margin:0">
          <div class="card-header"><span>${i.icon}</span><span class="card-title">${i.title}</span></div>
          <div class="card-body">
            <div style="font-size:.68rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-bottom:8px">${i.model}</div>
            <div class="ai-insight" style="margin:0"><span class="ai-arrow">⟩</span>${i.insight}<div class="ai-tags"><span class="ai-tag ${i.tagc}">${i.tag}</span></div></div>
          </div>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><span>🧠</span><span class="card-title">Framework Architecture</span></div>
      <div class="card-body">
        <div class="grid-4">
          ${[
            {layer:'Data Collection',items:'IoT Sensors, CCTV, GPS Buses, Weather API, CPCB API',color:'blue'},
            {layer:'ML/DL Pipeline',items:'Preprocessing → Feature Eng. → Model Training → Inference',color:'purple'},
            {layer:'LLM Integration',items:'Natural Language Query, Alert Summarization, Recommendations',color:'teal'},
            {layer:'Output Layer',items:'Dashboard, Alerts, Mobile Push, Municipal Reports, Maps API',color:'green'},
          ].map(l=>`
            <div style="padding:12px;background:var(--${l.color}-bg);border:1px solid var(--${l.color}-bdr,var(--border));border-radius:8px">
              <div style="font-weight:700;font-size:.8rem;color:var(--${l.color});margin-bottom:6px">${l.layer}</div>
              <div style="font-size:.72rem;color:var(--text2);line-height:1.5">${l.items}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

// modules/map.js
function render_map(el){
  // Add Leaflet CSS/JS if not already loaded
  if(!window.L){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload=()=>initializeMap(el);
    document.head.appendChild(script);
  } else {
    initializeMap(el);
  }
}

function initializeMap(el){
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>City Map</span></div>
    <div class="module-header"><div class="module-title">🗺️ City Intelligence Map</div><div class="module-subtitle">${window._currentCity||'Chandigarh'}</div></div>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <div style="display:flex;gap:8px;align-items:center">
        <input id="routeFrom" placeholder="From (lat,lng) or 'me'" style="padding:6px;border:1px solid var(--border);border-radius:8px;font-size:.85rem;width:220px" />
        <input id="routeTo" placeholder="To (lat,lng) or click destination" style="padding:6px;border:1px solid var(--border);border-radius:8px;font-size:.85rem;width:220px" />
        <button id="routeSuggestBtn" class="map-layer-btn" style="padding:6px 10px">Suggest Routes</button>
        <button id="useMyLocBtn" class="map-layer-btn" style="padding:6px 10px">Use My Location</button>
      </div>
      <button class="map-layer-btn active" onclick="filterMapLayers(this, 'all')">All Layers</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'traffic')">🚦 Traffic</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'bus')">🚌 Bus Stops</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'police')">👮 Police</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'waste')">🗑️ Waste Bins</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'repair')">🚧 Repairs</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'hospital')">🏥 Hospitals</button>
      <button class="map-layer-btn" onclick="filterMapLayers(this, 'aqi')">💨 AQI Stations</button>
    </div>
    <div class="card" style="margin-bottom:14px">
      <div id="smartCityMap" style="width:100%;height:500px;border-radius:12px;overflow:hidden"></div>
    </div>
  </div>`;
  
  setTimeout(()=>{
    const map=L.map('smartCityMap').setView([30.7333, 76.7794], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,
      attribution:'© OpenStreetMap contributors',
      className:'map-tiles'
    }).addTo(map);
    
    window.smartCityMapInstance = map;
    window.mapMarkers = {};

    // Mapping of layer types to Overpass tag filters and emoji icon
    const LAYER_DEFS = {
      hospital: {tags:[['amenity','hospital'],['amenity','clinic'],['amenity','doctors'],['healthcare','clinic']], icon:'🏥'},
      police: {tags:[['amenity','police']], icon:'👮'},
      bus: {tags:[['highway','bus_stop'],['amenity','bus_station']], icon:'🚌'},
      traffic: {tags:[['highway','traffic_signals']], icon:'🚦'},
      waste: {tags:[['amenity','waste_disposal'],['amenity','recycling']], icon:'🗑️'},
      repair: {tags:[['highway','construction'],['man_made','works']], icon:'🚧'},
      aqi: {tags:[['monitoring:air','yes'],['environment','air_quality_sensor']], icon:'💨'}
    };

    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    function buildQueryForType(bbox, def){
      // bbox: south,west,north,east
      const parts = [];
      def.tags.forEach(t=>{
        const k = t[0], v = t[1];
        parts.push(`node[${k}=${JSON.stringify(v)}](${bbox});`);
        parts.push(`way[${k}=${JSON.stringify(v)}](${bbox});`);
        parts.push(`relation[${k}=${JSON.stringify(v)}](${bbox});`);
      });
      return `[out:json][timeout:25];(${parts.join('')});out center;`;
    }

    function clearLayer(type){
      if(window.mapMarkers[type] && window.mapMarkers[type].clearLayers) window.mapMarkers[type].clearLayers();
      window.mapMarkers[type] = L.layerGroup().addTo(map);
    }

    // helper to set destination input from marker or external code
    window.setRouteTo = function(lat, lng, name){
      const el = document.getElementById('routeTo');
      if(!el) return;
      el.value = (lat).toFixed(6) + ',' + (lng).toFixed(6);
      if(name) el.dataset.label = name;
    };

    async function fetchLayer(type){
      const def = LAYER_DEFS[type];
      if(!def) return;
      const bounds = map.getBounds();
      const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
      const q = buildQueryForType(bbox, def);
      try{
        const res = await fetch(overpassUrl, {method:'POST', body:q, headers:{'Content-Type':'text/plain'}});
        if(!res.ok) throw new Error('Overpass error '+res.status);
        const data = await res.json();
        clearLayer(type);
        const seen = new Set();
        (data.elements||[]).forEach(e=>{
          const lat = e.lat || (e.center && e.center.lat);
          const lon = e.lon || (e.center && e.center.lon);
          if(!lat || !lon) return;
          if(seen.has(e.type+':'+e.id)) return; seen.add(e.type+':'+e.id);
          const name = (e.tags && (e.tags.name || e.tags.ref)) || type;
          const marker = L.marker([lat,lon],{
            icon: L.divIcon({html:`<div style="font-size:22px">${def.icon}</div>`, className:'map-marker '+type, iconSize:[28,28]})
          });
          const popupHtml = `<div style="font-size:.86rem;font-weight:700">${name}</div><div style="font-size:.72rem;color:#666">${type.toUpperCase()}</div><div style=\"margin-top:6px\"><button onclick=\"window.setRouteTo(${lat},${lon},${JSON.stringify(name)})\" style=\"padding:6px;border-radius:6px;background:var(--blue-bg);border:1px solid var(--blue-bdr);color:var(--blue);cursor:pointer\">Set as destination</button></div>`;
          marker.bindPopup(popupHtml);
          marker.on('click', ()=>{ window.setRouteTo(lat, lon, name); });
          marker.addTo(window.mapMarkers[type]);
        });
      }catch(err){
        console.error('Failed to load layer',type,err);
      }
    }

    // Debounce helper
    function debounce(fn, wait){let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a), wait);};}

    async function fetchAllLayers(){
      const types = Object.keys(LAYER_DEFS);
      await Promise.all(types.map(t=>fetchLayer(t)));
    }

    // Initialize empty layer groups
    Object.keys(LAYER_DEFS).forEach(t => { window.mapMarkers[t] = L.layerGroup().addTo(map); });

    // Initial fetch for view bounds
    fetchAllLayers();

    // Refresh on moveend (debounced)
    map.on('moveend', debounce(()=>{ fetchAllLayers(); }, 900));
    // If a pending location was requested (user clicked Nearby before opening map), fly to it
    if(window._pendingMapLocation){
      const p = window._pendingMapLocation;
      try{
        map.setView([p.lat,p.lng],16);
        L.popup().setLatLng([p.lat,p.lng]).setContent(p.name||'Location').openOn(map);
      }catch(e){console.error('Failed to fly to pending location',e)}
      delete window._pendingMapLocation;
    }

    // ROUTING: OSRM-based alternative routes and exposure scoring
    window.routeLayers = L.layerGroup().addTo(map);
    const osrmBase = 'https://router.project-osrm.org/route/v1/driving';

    function parseLatLngInput(val){
      if(!val) return null;
      val = val.trim();
      if(val.toLowerCase() === 'me') return 'me';
      const m = val.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
      if(m) return {lat: parseFloat(m[1]), lng: parseFloat(m[2])};
      return null;
    }

    function haversineKm(aLat,aLon,bLat,bLon){
      const toRad = v => v * Math.PI/180;
      const R = 6371;
      const dLat = toRad(bLat-aLat);
      const dLon = toRad(bLon-aLon);
      const aa = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(toRad(aLat))*Math.cos(toRad(bLat))*Math.sin(dLon/2)*Math.sin(dLon/2);
      return R*2*Math.atan2(Math.sqrt(aa),Math.sqrt(1-aa));
    }

    function pointNearRouteCount(routeCoords, maxKm){
      if(!window.mapMarkers || !window.mapMarkers.traffic) return 0;
      const trafficLayer = window.mapMarkers.traffic;
      const trafficMarkers = trafficLayer.getLayers ? trafficLayer.getLayers() : (trafficLayer||[]);
      let cnt = 0;
      trafficMarkers.forEach(m => {
        const p = m.getLatLng ? m.getLatLng() : null;
        if(!p) return;
        let minD = Infinity;
        for(let i=0;i<routeCoords.length;i++){
          const rc = routeCoords[i];
          const d = haversineKm(rc[1], rc[0], p.lat, p.lng);
          if(d < minD) minD = d;
        }
        if(minD <= maxKm) cnt++;
      });
      return cnt;
    }

    async function suggestRoutes(from, to){
      window.routeLayers.clearLayers();
      let start, end;
      if(from === 'me'){
        if(navigator.geolocation){
          const pos = await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej));
          start = [pos.coords.longitude, pos.coords.latitude];
        } else return alert('Geolocation not supported');
      } else {
        start = [from.lng, from.lat];
      }
      end = [to.lng, to.lat];
      const url = `${osrmBase}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&alternatives=true&geometries=geojson`;
      try{
        const r = await fetch(url);
        const j = await r.json();
        if(!j.routes || !j.routes.length) return alert('No routes found');
        const routes = j.routes.map((rt, idx)=>{
          const coords = rt.geometry.coordinates;
          const expos = pointNearRouteCount(coords, 0.2);
          return {idx, duration: rt.duration, distance: rt.distance, coords, expos};
        });
        routes.sort((a,b)=>a.duration - b.duration);
        routes.forEach((rte, i)=>{
          const latlngs = rte.coords.map(c=>[c[1], c[0]]);
          const color = i===0 ? '#1f8d3b' : (i===1 ? '#ff8c00' : '#3b7bd9');
          const poly = L.polyline(latlngs, {color, weight:6, opacity:0.85 - (i*0.15)}).addTo(window.routeLayers);
          poly.bindPopup(`<div style="font-weight:700">Route ${i+1}</div><div style="font-size:.85rem">Time: ${(rte.duration/60).toFixed(0)} min · Dist: ${(rte.distance/1000).toFixed(1)} km · Traffic points nearby: ${rte.expos}</div>`);
          poly.on('click', ()=>{ map.fitBounds(poly.getBounds()); poly.openPopup(); });
        });
        const summary = routes.map((r,i)=>`<div style="padding:6px;border-bottom:1px solid var(--border);cursor:pointer" onclick="(function(){const map=window.smartCityMapInstance;const layers=window.routeLayers.getLayers();map.fitBounds(layers[${i}].getBounds());layers[${i}].openPopup();})()"> <strong>Route ${i+1}</strong> — ${(r.duration/60).toFixed(0)} min · ${(r.distance/1000).toFixed(1)} km · Traffic:${r.expos}</div>`).join('');
        const existing = document.getElementById('routeSummary');
        if(existing) existing.innerHTML = summary; else {
          const c = document.createElement('div'); c.id='routeSummary'; c.style.marginTop='8px'; c.className='card'; c.innerHTML = `<div class="card-body" style="padding:8px">${summary}</div>`; document.querySelector('#smartCityMap').parentNode.appendChild(c);
        }
      }catch(err){
        console.error('Route fetch failed', err);
        alert('Failed to fetch routes');
      }
    }

    // Wire up UI
    const rsBtn = document.getElementById('routeSuggestBtn');
    const useMyBtn = document.getElementById('useMyLocBtn');
    if(rsBtn){ rsBtn.addEventListener('click', async ()=>{
      const f = parseLatLngInput(document.getElementById('routeFrom').value);
      const t = parseLatLngInput(document.getElementById('routeTo').value);
      if(!f || !t) return alert('Please enter valid From/To, or use "me"');
      let from = f, to = t; if(f === 'me') from = 'me'; await suggestRoutes(from, to);
    }); }
    if(useMyBtn){ useMyBtn.addEventListener('click', ()=>{ document.getElementById('routeFrom').value = 'me'; }); }

    // allow clicking map to set destination
    map.on('click', (ev)=>{ const pt = ev.latlng; const elTo = document.getElementById('routeTo'); if(elTo) elTo.value = pt.lat.toFixed(6)+','+pt.lng.toFixed(6); });
  }, 100);
}

function filterMapLayers(btn, layerType){
  document.querySelectorAll('.map-layer-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  
  const map = window.smartCityMapInstance;
  if(!map || !window.mapMarkers) return;

  if(layerType === 'all'){
    Object.keys(window.mapMarkers).forEach(type=>{
      const layer = window.mapMarkers[type];
      if(layer && !map.hasLayer(layer)) map.addLayer(layer);
    });
    return;
  }

  // Show only the selected layer: add that group's layer and remove others
  Object.keys(window.mapMarkers).forEach(type=>{
    const layer = window.mapMarkers[type];
    if(!layer) return;
    if(type === layerType){
      if(!map.hasLayer(layer)) map.addLayer(layer);
    } else {
      if(map.hasLayer(layer)) map.removeLayer(layer);
    }
  });
}

// Add map-layer-btn styles inline via JS
(function(){
  if(!document.getElementById('mapBtnStyle')){
    const s=document.createElement('style');
    s.id='mapBtnStyle';
    s.textContent=`.map-layer-btn{padding:6px 12px;border:1px solid var(--border);background:var(--surface);color:var(--text2);border-radius:20px;font-size:.75rem;cursor:pointer;transition:all .18s;font-family:'Outfit',sans-serif}.map-layer-btn:hover,.map-layer-btn.active{background:var(--blue);color:#fff;border-color:var(--blue);font-weight:600}.map-marker{opacity:1;transition:opacity .3s ease}.leaflet-container{font-family:'Outfit',sans-serif}.chip-teal{background:var(--teal-bg);color:var(--teal)}.chip-teal::before{content:'●';font-size:.5rem}`;
    document.head.appendChild(s);
  }
})();
