// Simple test admin module
function render_admin(el) {
  console.log('Admin module loading...');
  
  try {
    el.innerHTML = `
      <div class="fade-in">
        <div class="breadcrumb">Smart City / <span>Admin Panel</span></div>
        <div class="module-header">
          <div class="module-title">🔐 Admin Dashboard</div>
          <div class="module-subtitle">System Management · Test</div>
        </div>
        
        <div style="padding: 20px; background: var(--surface); border-radius: 12px; margin: 20px 0;">
          <h2>Admin Panel Test</h2>
          <p>If you can see this, the admin module is loading successfully!</p>
          <button onclick="testAdminFunction()" style="background: var(--accent); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">Test Function</button>
        </div>
      </div>
    `;
    
    console.log('Admin module loaded successfully');
  } catch (error) {
    console.error('Error loading admin module:', error);
    el.innerHTML = `
      <div style="padding: 20px; background: var(--red-bg); color: var(--red); border-radius: 12px; margin: 20px 0;">
        <h2>Admin Module Error</h2>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

function testAdminFunction() {
  alert('Admin function working!');
  console.log('Admin function called successfully');
}
