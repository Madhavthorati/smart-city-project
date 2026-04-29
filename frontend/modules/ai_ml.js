// modules/ai_ml.js — Machine Learning Powered AI Module

// ML Backend Configuration
const ML_API_URL = 'http://localhost:5008';

// AI Module with ML Integration
class SmartCityAI {
    constructor() {
        this.isMLBackendAvailable = false;
        this.fallbackMode = false;
        this.checkMLBackend();
    }

    async checkMLBackend() {
        try {
            const response = await fetch(`${ML_API_URL}/api/ai/health`);
            if (response.ok) {
                this.isMLBackendAvailable = true;
                console.log('✅ ML Backend Connected');
            }
        } catch (error) {
            console.log('⚠️ ML Backend not available, using fallback mode');
            this.fallbackMode = true;
        }
    }

    async analyzeQuery(query) {
        if (this.isMLBackendAvailable) {
            return await this.mlAnalyzeQuery(query);
        } else {
            return await this.fallbackAnalyzeQuery(query);
        }
    }

    async mlAnalyzeQuery(query) {
        try {
            const response = await fetch(`${ML_API_URL}/api/ai/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
            });

            if (!response.ok) {
                throw new Error('ML Backend request failed');
            }

            const result = await response.json();
            return {
                intent: result.intent,
                confidence: result.confidence,
                response: result.response,
                mlInsights: result.ml_insights,
                timestamp: result.timestamp
            };
        } catch (error) {
            console.error('ML Analysis failed:', error);
            this.fallbackMode = true;
            return await this.fallbackAnalyzeQuery(query);
        }
    }

    async fallbackAnalyzeQuery(query) {
        // Fallback rule-based analysis
        const fallbackKB = {
            traffic: '🚦 Current traffic analysis shows moderate congestion. Tribune Chowk has 65% congestion. Use alternate routes during peak hours.',
            transport: '🚌 Public transport is operating normally. Bus 17 arriving in 5 minutes. Metro trains running on schedule.',
            environment: '🌤️ Air quality is moderate (AQI: 120). Sensitive groups should limit prolonged outdoor exposure.',
            utilities: '💧 Water supply is stable. Electricity grid uptime at 96%. No reported outages.',
            healthcare: '🏥 Hospitals are operating normally. PGIMER has 15 beds available. Average wait time: 25 minutes.',
            services: '🗑️ Waste collection is on schedule. 85% of bins collected today. Recycling rate: 35%.',
            events: '📅 No major events today. Normal traffic expected.',
            emergency: '🚨 No active emergencies reported. All emergency services operational.'
        };

        const lm = query.toLowerCase();
        let intent = 'general';
        let response = fallbackKB.general || '🤖 I can help with traffic, transport, air quality, utilities, healthcare, waste management, events, and emergencies.';

        for (const [key, ans] of Object.entries(fallbackKB)) {
            if (lm.includes(key) || 
                (key === 'transport' && (lm.includes('bus') || lm.includes('metro'))) ||
                (key === 'environment' && (lm.includes('air') || lm.includes('aqi'))) ||
                (key === 'utilities' && (lm.includes('water') || lm.includes('electricity'))) ||
                (key === 'healthcare' && (lm.includes('hospital') || lm.includes('doctor'))) ||
                (key === 'services' && (lm.includes('waste') || lm.includes('garbage'))) ||
                (key === 'emergency' && (lm.includes('police') || lm.includes('fire')))) {
                intent = key;
                response = ans;
                break;
            }
        }

        return {
            intent: intent,
            confidence: 0.7,
            response: response,
            mlInsights: 'Fallback mode - using rule-based analysis',
            timestamp: new Date().toISOString()
        };
    }

    async getCityData() {
        try {
            const response = await fetch(`${ML_API_URL}/api/ai/city-data`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('City data fetch failed, using fallback');
        }
        return this.getFallbackCityData();
    }

    getFallbackCityData() {
        return {
            traffic: { current_congestion: 65, incidents: ['Moderate traffic at Tribune Chowk'] },
            air_quality: { aqi: 120, pm25: 45, status: 'Moderate' },
            water_supply: { reservoir_levels: { 'North Zone': 75, 'South Zone': 60 } },
            electricity: { grid_uptime: 96, load_factor: 78 },
            public_transport: { buses: [], metro: { trains_running: 10 } },
            healthcare: { hospitals: { 'PGIMER': { beds_available: 15 } } },
            waste_management: { collection_status: [], landfill_capacity: 75 },
            events: { current: [], upcoming: [] }
        };
    }

    async getPredictions(service) {
        try {
            const response = await fetch(`${ML_API_URL}/api/ai/predictions/${service}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('Predictions fetch failed');
        }
        return { predictions: [] };
    }
}

// Initialize AI
const smartCityAI = new SmartCityAI();

// Enhanced Chat Function with ML
async function sendMLChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const msgs = document.getElementById('chatMessages');

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = msg;
    msgs.appendChild(userMsg);
    input.value = '';

    // Thinking indicator with ML branding
    const think = document.createElement('div');
    think.className = 'chat-msg ai';
    think.innerHTML = '<div class="thinking-dots"><div class="think-dot"></div><div class="think-dot"></div><div class="think-dot"></div></div>🤖 AI Analyzing...';
    msgs.appendChild(think);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(async () => {
        think.remove();
        
        try {
            const result = await smartCityAI.analyzeQuery(msg);
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'chat-msg ai';
            
            // Format ML-enhanced response
            let formattedResponse = result.response;
            
            // Add ML insights if available
            if (result.mlInsights && !smartCityAI.fallbackMode) {
                formattedResponse += `\n\n💡 **ML Insights:** ${result.mlInsights}`;
            }
            
            // Add confidence indicator
            const confidenceEmoji = result.confidence > 0.8 ? '🟢' : result.confidence > 0.6 ? '🟡' : '🔴';
            formattedResponse += `\n\n${confidenceEmoji} Confidence: ${(result.confidence * 100).toFixed(1)}%`;
            
            // Add mode indicator
            if (smartCityAI.fallbackMode) {
                formattedResponse += '\n\n⚠️ Running in fallback mode';
            } else {
                formattedResponse += '\n\n✅ Powered by Machine Learning';
            }
            
            aiMsg.innerHTML = formattedResponse.replace(/\n/g, '<br>');
            msgs.appendChild(aiMsg);
            
        } catch (error) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'chat-msg ai';
            errorMsg.textContent = '🤖 Sorry, I encountered an error. Please try again.';
            msgs.appendChild(errorMsg);
        }
        
        msgs.scrollTop = msgs.scrollHeight;
    }, 1000);
}

// AI Dashboard Function
function showAIDashboard() {
    const content = document.getElementById('moduleContent');
    content.innerHTML = `
        <div class="ai-dashboard">
            <div class="ai-header">
                <h2>🤖 Smart City AI Analysis</h2>
                <div class="ai-status">
                    <span id="mlStatus">Checking ML Backend...</span>
                </div>
            </div>
            
            <div class="ai-controls">
                <div class="input-group">
                    <input type="text" id="aiQueryInput" placeholder="Ask about traffic, transport, air quality, utilities...">
                    <button onclick="analyzeWithAI()">🔍 Analyze</button>
                </div>
            </div>
            
            <div class="ai-results" id="aiResults">
                <div class="ai-placeholder">
                    <h3>🤖 AI Capabilities</h3>
                    <ul>
                        <li>🚦 Traffic Prediction & Analysis</li>
                        <li>🚌 Public Transport Optimization</li>
                        <li>🌤️ Air Quality Forecasting</li>
                        <li>💧 Utility Monitoring</li>
                        <li>🏥 Healthcare Resource Analysis</li>
                        <li>🗑️ Waste Management Optimization</li>
                        <li>📅 Event Impact Assessment</li>
                        <li>🚨 Emergency Response Planning</li>
                    </ul>
                </div>
            </div>
            
            <div class="ai-insights">
                <h3>📊 Real-time City Data</h3>
                <div id="cityDataDisplay" class="data-grid">
                    Loading city data...
                </div>
            </div>
        </div>
    `;
    
    // Check ML status and load data
    updateAIStatus();
    loadCityData();
}

async function updateAIStatus() {
    const statusElement = document.getElementById('mlStatus');
    
    if (smartCityAI.isMLBackendAvailable) {
        statusElement.innerHTML = '✅ ML Backend Connected';
        statusElement.className = 'status-online';
    } else if (smartCityAI.fallbackMode) {
        statusElement.innerHTML = '⚠️ Fallback Mode Active';
        statusElement.className = 'status-fallback';
    } else {
        statusElement.innerHTML = '🔄 Checking...';
        statusElement.className = 'status-checking';
    }
}

async function analyzeWithAI() {
    const input = document.getElementById('aiQueryInput');
    const query = input.value.trim();
    
    if (!query) {
        alert('Please enter a query to analyze');
        return;
    }
    
    const resultsDiv = document.getElementById('aiResults');
    resultsDiv.innerHTML = '<div class="ai-thinking">🤖 AI is analyzing your query...</div>';
    
    try {
        const result = await smartCityAI.analyzeQuery(query);
        
        resultsDiv.innerHTML = `
            <div class="ai-result">
                <div class="result-header">
                    <h4>🎯 Intent: ${result.intent}</h4>
                    <div class="confidence">
                        <span class="confidence-bar" style="width: ${result.confidence * 100}%"></span>
                        <span class="confidence-text">${(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="result-content">
                    <p>${result.response.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="result-meta">
                    <small>📊 ${result.mlInsights}</small><br>
                    <small>🕐 ${new Date(result.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `;
        
    } catch (error) {
        resultsDiv.innerHTML = '<div class="ai-error">❌ Analysis failed. Please try again.</div>';
    }
}

async function loadCityData() {
    const dataDiv = document.getElementById('cityDataDisplay');
    
    try {
        const cityData = await smartCityAI.getCityData();
        
        dataDiv.innerHTML = `
            <div class="data-card">
                <h4>🚦 Traffic</h4>
                <p>Congestion: ${cityData.traffic?.current_congestion || 'N/A'}%</p>
            </div>
            <div class="data-card">
                <h4>🌤️ Air Quality</h4>
                <p>AQI: ${cityData.air_quality?.aqi || 'N/A'}</p>
            </div>
            <div class="data-card">
                <h4>💧 Water Supply</h4>
                <p>Status: Normal</p>
            </div>
            <div class="data-card">
                <h4>⚡ Electricity</h4>
                <p>Uptime: ${cityData.electricity?.grid_uptime || 'N/A'}%</p>
            </div>
            <div class="data-card">
                <h4>🏥 Healthcare</h4>
                <p>Hospitals: Available</p>
            </div>
            <div class="data-card">
                <h4>🗑️ Waste</h4>
                <p>Collection: Active</p>
            </div>
        `;
        
    } catch (error) {
        dataDiv.innerHTML = '<div class="data-error">❌ Failed to load city data</div>';
    }
}

// Export for use in other modules
window.SmartCityAI = SmartCityAI;
window.smartCityAI = smartCityAI;
window.sendMLChat = sendMLChat;
window.showAIDashboard = showAIDashboard;
window.analyzeWithAI = analyzeWithAI;
