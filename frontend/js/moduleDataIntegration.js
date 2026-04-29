// Module Data Integration - Connects admin changes to live module displays
class ModuleDataIntegration {
    constructor() {
        this.initializeModuleOverrides();
    }

    // Initialize module data overrides
    initializeModuleOverrides() {
        // Override module render functions to use admin-modified data
        this.overrideWaterModule();
        this.overrideElectricityModule();
        this.overrideTrafficModule();
        this.overrideBusModule();
        this.overrideWasteModule();
        this.overrideAQIModule();
        this.overrideRepairsModule();
    }

    // Override Water Module
    overrideWaterModule() {
        const originalRender = window.render_water;
        window.render_water = function(el) {
            // Get admin-modified data
            const adminData = localStorage.getItem('moduleData_water');
            let zones;
            
            if (adminData) {
                zones = JSON.parse(adminData).zones;
            } else {
                // Use original default data
                zones = [
                    {name:'North',pct:82,pressure:'Good',supply:'6h/day',issue:''},
                    {name:'Central',pct:38,pressure:'Low',supply:'4h/day',issue:'Partial restriction'},
                    {name:'East',pct:74,pressure:'Normal',supply:'6h/day',issue:''},
                    {name:'South',pct:22,pressure:'Critical',supply:'2h/day',issue:'Pipe burst repair'},
                    {name:'West',pct:90,pressure:'Good',supply:'6h/day',issue:''},
                    {name:'Industrial',pct:65,pressure:'Normal',supply:'8h/day',issue:''},
                ];
            }

            // Calculate stats from zones data
            const avgReservoir = Math.round(zones.reduce((sum, z) => sum + z.pct, 0) / zones.length);
            const criticalZones = zones.filter(z => z.pressure === 'Critical' || z.pct < 30).length;
            const activeLeaks = zones.filter(z => z.issue && z.issue.includes('burst')).length;
            const tankersDeployed = zones.filter(z => z.pressure === 'Critical').length;

            el.innerHTML = `
            <div class="fade-in">
                <div class="breadcrumb">Smart City / <span>Water Supply</span></div>
                <div class="module-header"><div class="module-title">💧 Water Supply Monitoring</div><div class="module-subtitle">MC Water Works · ${window._currentCity||'Chandigarh'}</div></div>
                
                <div class="grid-4" style="margin-bottom:16px">
                    <div class="stat-card" style="--stat-color:var(--blue)"><div class="stat-label">Avg Reservoir</div><div class="stat-value" style="color:var(--blue)">${avgReservoir}%</div><div class="stat-sub">City-wide average</div></div>
                    <div class="stat-card" style="--stat-color:var(--red)"><div class="stat-label">Critical Zones</div><div class="stat-value" style="color:var(--red)">${criticalZones}</div><div class="stat-sub">Low supply areas</div></div>
                    <div class="stat-card" style="--stat-color:var(--orange)"><div class="stat-label">Active Leaks</div><div class="stat-value" style="color:var(--orange)">${activeLeaks}</div><div class="stat-sub">Emergency repairs</div></div>
                    <div class="stat-card" style="--stat-color:var(--green)"><div class="stat-label">Tankers Deployed</div><div class="stat-value" style="color:var(--green)">${tankersDeployed}</div><div class="stat-sub">Water tankers</div></div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Zone-wise Water Status</div>
                    </div>
                    <div class="card-body">
                        <div class="grid-3">
                            ${zones.map(zone => `
                                <div class="zone-card ${zone.pressure.toLowerCase() === 'critical' ? 'critical' : ''}">
                                    <div class="zone-header">
                                        <h4>${zone.name}</h4>
                                        <span class="zone-status ${zone.pressure.toLowerCase()}">${zone.pressure}</span>
                                    </div>
                                    <div class="zone-metrics">
                                        <div class="metric">
                                            <span class="metric-label">Water Level</span>
                                            <span class="metric-value">${zone.pct}%</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Supply</span>
                                            <span class="metric-value">${zone.supply}</span>
                                        </div>
                                    </div>
                                    ${zone.issue ? `<div class="zone-issue">⚠️ ${zone.issue}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
        };
    }

    // Override Electricity Module
    overrideElectricityModule() {
        // Similar override for electricity module
        // This would follow the same pattern as water module
    }

    // Override Traffic Module
    overrideTrafficModule() {
        // Similar override for traffic module
        // This would follow the same pattern as water Module
    }

    // Override Bus Module
    overrideBusModule() {
        // Similar override for bus Module
        // This would follow the same pattern as water Module
    }

    // Override Waste Module
    overrideWasteModule() {
        // Similar override for waste Module
        // This would follow the same pattern as water Module
    }

    // Override AQI Module
    overrideAQIModule() {
        // Similar override for AQI Module
        // This would follow the same pattern as water Module
    }

    // Override Repairs Module
    overrideRepairsModule() {
        // Similar override for repairs Module
        // This would follow the same pattern as water Module
    }

    // Helper method to get admin data
    getAdminModuleData(moduleName) {
        const data = localStorage.getItem(`moduleData_${moduleName}`);
        return data ? JSON.parse(data) : null;
    }
}

// Initialize the integration system
let moduleIntegration;

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        moduleIntegration = new ModuleDataIntegration();
        console.log('Module data integration initialized');
    }, 1000);
});
