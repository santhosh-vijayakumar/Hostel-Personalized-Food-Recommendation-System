from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)

# --- Dummy Data Loading (Simulating what might come from the DB or a pre-trained model) ---

def get_recommendations(user_prefs, available_foods, recent_orders):
    """
    Simple Hybrid Recommendation Logic:
    1. Filter by Diet (Veg/Non-Veg) - Strict filter
    2. Score by Cuisine Preference matches
    3. Score by Spice Level match
    4. Boost if in recent orders (Frequency)
    """
    
    recommendations = []
    
    foods_df = pd.DataFrame(available_foods)
    
    # 1. Strict Filter: Veg/Non-Veg
    # user_prefs['vegNonVeg'] might be 'Veg' or 'Non-veg' or 'Both'
    # If user is Veg, strictly filter out Non-veg.
    if user_prefs.get('vegNonVeg') == 'Veg':
        foods_df = foods_df[foods_df['vegNonVeg'] == 'Veg']
    
    if foods_df.empty:
        return [{"name": "No items match your strict diet", "reason": "Try changing filters"}]

    # Calculate Scores
    scores = {} # food_id -> score
    reasons = {} # food_id -> reason string
    
    preferred_cuisines = user_prefs.get('cuisines', [])
    preferred_spice = user_prefs.get('spiceLevel', 'Medium')
    
    for _, food in foods_df.iterrows():
        score = 0
        reason_parts = []
        
        # Cuisine Match (+5)
        if food['cuisine'] in preferred_cuisines:
            score += 5
            reason_parts.append(f"Matches your love for {food['cuisine']}")
            
        # Spice Match (+3)
        if food['spiceLevel'] == preferred_spice:
            score += 3
            reason_parts.append("Perfect spice level")
            
        # Recent Order Boost (+2)
        # Check if food was ordered recently
        recently_ordered_ids = [item['foodId'] for order in recent_orders for item in order.get('items', [])] if recent_orders else []

        if food['id'] in recently_ordered_ids:
            score += 2
            reason_parts.append("You ordered this recently")
            
        if score > 0:
            scores[food['id']] = score
            reasons[food['id']] = " & ".join(reason_parts)
    
    # Sort by score
    sorted_foods = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    # Get Top 5
    top_recommendations = []
    for food_id, score in sorted_foods[:5]:
        food_name = foods_df[foods_df['id'] == food_id].iloc[0]['name']
        top_recommendations.append({
            "name": food_name,
            "reason": reasons[food_id]
        })
        
    # Cold Start / Fallback if no scores
    if not top_recommendations:
        # Just return random or popular within allowed diet
        top_recommendations = [
            {"name": row['name'], "reason": "Popular choice"} 
            for _, row in foods_df.head(3).iterrows()
        ]

    return top_recommendations

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        user_preferences = data.get('user_preferences', {})
        recent_orders = data.get('recent_orders', [])
        available_foods = data.get('available_foods', [])
        
        if not available_foods:
             return jsonify({'recommendations': []})

        recs = get_recommendations(user_preferences, available_foods, recent_orders)
        
        return jsonify({'recommendations': recs})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run on port 5001 to avoid conflict with Node backend (5000)
    app.run(port=5001, debug=True)
