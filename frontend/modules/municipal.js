function render_municipal(el){
  const svcs=[
    {ic:'📋',n:'Property Tax Payment',s:'Online',url:'https://www.mcchandigarh.gov.in'},
    {ic:'🔧',n:'Grievance Portal',s:'Online',url:'https://www.mcchandigarh.gov.in'},
    {ic:'🏗️',n:'Building Permissions',s:'Online',url:'https://www.mcchandigarh.gov.in'},
    {ic:'💡',n:'Street Light Complaint',s:'Online',url:'https://www.mcchandigarh.gov.in'},
    {ic:'🌊',n:'Sewage / Drainage',s:'Call 1916',url:'tel:1916'},
    {ic:'🗑️',n:'Sanitation Complaint',s:'Call 1800',url:'tel:1800'},
    {ic:'🛣️',n:'Road Repair Request',s:'Online',url:'https://www.mcchandigarh.gov.in'},
    {ic:'📜',n:'Birth / Death Certificate',s:'Online',url:'https://www.mcchandigarh.gov.in'},
  ];
  el.innerHTML=`
  <div class="fade-in">
    <div class="breadcrumb">Smart City / <span>Municipal Corporation</span></div>
    <div class="module-header"><div class="module-title">🏛️ Municipal Corporation</div><div class="module-subtitle">${window._currentCity||'Chandigarh'}</div></div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Open Services</div><div class="stat-value" style="color:var(--blue)">12</div><div class="stat-sub">Online + Walk-in</div></div>
      <div class="stat-card" style="--stat-color:var(--yellow)"><div class="stat-label">Pending</div><div class="stat-value" style="color:var(--yellow)">348</div><div class="stat-sub">In queue</div></div>
      <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Resolved Today</div><div class="stat-value" style="color:var(--green)">52</div><div class="stat-sub">Grievances closed</div></div>
      <div class="stat-card" style="--stat-color:var(--purple)"><div class="stat-label">Helpline</div><div class="stat-value" style="color:var(--purple)">1800</div><div class="stat-sub">Mon–Sat 9AM–5PM</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span>🛎️</span><span class="card-title">Citizen Services</span></div>
        <div class="card-body">
          ${svcs.map(s=>`
            <div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="window.open('${s.url}','_blank')" onmouseover="this.style.background='var(--bg2)'" onmouseout="this.style.background=''">
              <span style="font-size:1.1rem;width:24px;text-align:center">${s.ic}</span>
              <span style="flex:1;font-size:.8rem">${s.n}</span>
              <span class="chip chip-blue" style="font-size:.65rem">${s.s}</span>
              <span style="color:var(--blue);font-size:.8rem">→</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>📞</span><span class="card-title">Department Contacts</span></div>
        <div class="card-body">
          ${[['Commissioner Office','0172-2700611','9–5'],['Water Works Div.','1916','24/7'],['Health & Sanitation','0172-2700890','9–5'],['Engineering (Roads)','0172-2701018','9–5'],['Revenue Dept.','0172-2701023','9–5'],['Fire Services','101','24/7'],['Complaints Cell','1800-XXX-XXXX','9–5']].map(([d,p,h])=>`
            <div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border)">
              <span style="flex:1;font-size:.78rem">${d}</span>
              <a href="tel:${p}" class="mono" style="font-size:.73rem;color:var(--blue);text-decoration:none">${p}</a>
              <span class="chip chip-green" style="font-size:.65rem">${h}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}