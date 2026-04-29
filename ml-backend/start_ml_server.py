#!/usr/bin/env python3
"""
Smart City ML Backend - Direct Start Script
No external dependencies, just basic Flask
"""

print("🔧 Importing Flask...")
try:
    from flask import Flask, request, jsonify
    from datetime import datetime
    import random
    print("✅ Flask imported successfully")
except ImportError as e:
    print(f"❌ Flask import error: {e}")
    print("🔧 Please install Flask: pip install flask")
    exit(1)

print("🤖 Creating Flask app...")
app = Flask(__name__)

# Add CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

print("📊 Setting up AI analysis...")
# Simple AI analysis
def analyze_query_simple(query):
    """Simple pattern matching analysis"""
    query_lower = query.lower()
    
    patterns = {
        'traffic': ['traffic', 'jam', 'congestion', 'roads', 'highway', 'commute'],
        'transport': ['bus', 'metro', 'train', 'transport', 'route', 'schedule'],
        'environment': ['air', 'pollution', 'quality', 'aqi', 'weather', 'environment'],
        'utilities': ['water', 'supply', 'electricity', 'power', 'outage'],
        'healthcare': ['hospital', 'doctor', 'medical', 'emergency', 'health'],
        'services': ['garbage', 'waste', 'collection', 'cleanliness', 'sanitation'],
        'events': ['festival', 'celebration', 'event', 'gathering', 'concert'],
        'emergency': ['emergency', 'police', 'fire', 'ambulance', 'disaster']
    }
    
    # Find best match
    best_intent = 'general'
    best_score = 0
    
    for intent, keywords in patterns.items():
        score = sum(1 for keyword in keywords if keyword in query_lower)
        if score > best_score:
            best_score = score
            best_intent = intent
    
    confidence = min(0.95, 0.5 + (best_score * 0.15))
    
    # Generate response
    if best_intent == 'traffic':
        response = f"🚦 **Traffic Analysis**\n\nCurrent congestion: {random.randint(20, 95)}%\nPredictions: Heavy traffic expected at 6:30 PM (85% congestion)\nRecommendation: Use alternate routes during peak hours."
    elif best_intent == 'transport':
        response = f"🚌 **Transport Analysis**\n\nBus 17 arriving in 5 minutes\nMetro trains running on schedule\nAuto-rickshaws: 350 available, avg wait 4 minutes"
    elif best_intent == 'environment':
        aqi = random.randint(50, 200)
        response = f"🌤️ **Air Quality Analysis**\n\nAQI: {aqi} ({'Moderate' if aqi < 100 else 'Unhealthy'})\nPM2.5: {random.randint(20, 80)} µg/m³\nRecommendation: {'Normal outdoor activity' if aqi < 100 else 'Limit prolonged outdoor exposure'}"
    elif best_intent == 'utilities':
        response = f"💧 **Utilities Analysis**\n\nWater pressure: 3.2 bar (Normal)\nReservoir levels: North 75%, South 62%\nElectricity: Grid uptime 96%, no major outages"
    elif best_intent == 'healthcare':
        response = f"🏥 **Healthcare Analysis**\n\nPGIMER: 15 beds available, 35 min wait\nGMCH: 25 beds available, 25 min wait\nFortis: 45 beds available, 15 min wait\nRecommendation: Fortis has shortest wait time"
    elif best_intent == 'services':
        response = f"🗑️ **Services Analysis**\n\nWaste collection: 85% completed today\nLandfill capacity: 75%\nCritical areas: 8 sectors need attention\nNext collection: Tomorrow 8 AM"
    elif best_intent == 'events':
        response = f"📅 **Events Analysis**\n\nCurrent: Rose Festival at Sector 16\nUpcoming: Smart City Summit tomorrow\nTraffic impact: Expect delays in Sectors 16-17\nRecommendation: Use alternate routes"
    elif best_intent == 'emergency':
        response = f"🚨 **Emergency Analysis**\n\nActive: Water pipe burst at Sector 22\nEmergency contacts: Police 100, Fire 101, Ambulance 108\nResponse time: 12 minutes average\nStatus: All services operational"
    else:
        response = "🤖 **AI Analysis**\n\nI can help with traffic, transport, air quality, utilities, healthcare, waste management, events, and emergencies. Please specify which area you'd like information about."
    
    # Add confidence
    enhanced_response = f"🤖 **AI Analysis (Confidence: {confidence:.1%})**\n\n{response}"
    
    if confidence < 0.6:
        enhanced_response += f"\n\n💡 *I'm {confidence:.1%} confident. Could you provide more details?*"
    
    return {
        'intent': best_intent,
        'confidence': confidence,
        'response': enhanced_response,
        'timestamp': datetime.now().isoformat()
    }

print("🌐 Setting up routes...")
@app.route('/')
def home():
    return jsonify({
        'message': 'Smart City ML Backend - Working!',
        'status': 'running',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/ai/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    """Analyze user query"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'Query is required'}), 400
        
        query = data['query']
        if not query.strip():
            return jsonify({'error': 'Query cannot be empty'}), 400
        
        result = analyze_query_simple(query)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'model_status': 'pattern_matching_active',
        'timestamp': datetime.now().isoformat(),
        'capabilities': ['traffic', 'transport', 'environment', 'utilities', 'healthcare', 'services', 'events', 'emergency'],
        'version': '1.0.0'
    })

@app.route('/api/ai/test', methods=['GET'])
def test():
    """Test endpoint"""
    test_query = "How is traffic today?"
    test_result = analyze_query_simple(test_query)
    
    return jsonify({
        'message': 'ML Backend is working!',
        'test_query': test_query,
        'test_result': test_result,
        'timestamp': datetime.now().isoformat()
    })

print("🚀 Starting server...")
print("=" * 60)
print("🤖 SMART CITY ML BACKEND - DIRECT START")
print("=" * 60)
print("✅ Simple Flask server")
print("✅ Built-in CORS support")
print("✅ Pattern matching AI")
print("✅ Port 5008 (clean start)")
print("=" * 60)
print("🌐 Server will be available at: http://localhost:5008")
print("📊 API Endpoints:")
print("   POST /api/ai/analyze - Analyze queries")
print("   GET  /api/ai/health - Health check")
print("   GET  /api/ai/test - Test endpoint")
print("=" * 60)

try:
    app.run(host='0.0.0.0', port=5008, debug=False)
except Exception as e:
    print(f"❌ Error starting server: {e}")
    print("🔧 Trying different port...")
    app.run(host='0.0.0.0', port=5009, debug=False)
