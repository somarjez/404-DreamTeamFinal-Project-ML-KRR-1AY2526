from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load models
print("Loading models...")
tfidf = pickle.load(open("models/tfidf_model.pkl", "rb"))
tfidf_matrix = pickle.load(open("models/tfidf_matrix.pkl", "rb"))
price_model = pickle.load(open("models/price_model.pkl", "rb"))
df = pickle.load(open("models/housing_data.pkl", "rb"))
print("Models loaded successfully!")

features = ["bedrooms", "bathrooms", "car_spaces", "floor_area_sqm", "land_size_sqm"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        user_input = data.get('description', '')
        top_n = int(data.get('top_n', 5))
        
        # Get recommendations
        user_vec = tfidf.transform([user_input])
        similarity = cosine_similarity(user_vec, tfidf_matrix)
        top_indices = similarity[0].argsort()[-top_n:][::-1]
        
        recommendations = []
        for idx in top_indices:
            house = df.iloc[idx]
            recommendations.append({
                'description': house['description'],
                'location': house['location'],
                'bedrooms': int(house['bedrooms']),
                'bathrooms': int(house['bathrooms']),
                'car_spaces': int(house['car_spaces']),
                'floor_area_sqm': float(house['floor_area_sqm']),
                'land_size_sqm': float(house['land_size_sqm']),
                'price': float(house['price']),
                'category': house['category']
            })
        
        return jsonify({'success': True, 'recommendations': recommendations})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/filter', methods=['POST'])
def filter_homes():
    try:
        data = request.json
        bedrooms = data.get('bedrooms')
        bathrooms = data.get('bathrooms')
        min_price = data.get('min_price')
        max_price = data.get('max_price')
        category = data.get('category')
        
        filtered_df = df.copy()
        
        if bedrooms:
            filtered_df = filtered_df[filtered_df['bedrooms'] == int(bedrooms)]
        if bathrooms:
            filtered_df = filtered_df[filtered_df['bathrooms'] == int(bathrooms)]
        if min_price:
            filtered_df = filtered_df[filtered_df['price'] >= float(min_price)]
        if max_price:
            filtered_df = filtered_df[filtered_df['price'] <= float(max_price)]
        if category and category != 'all':
            filtered_df = filtered_df[filtered_df['category'] == category]
        
        results = []
        for _, house in filtered_df.head(10).iterrows():
            results.append({
                'description': house['description'],
                'location': house['location'],
                'bedrooms': int(house['bedrooms']),
                'bathrooms': int(house['bathrooms']),
                'car_spaces': int(house['car_spaces']),
                'floor_area_sqm': float(house['floor_area_sqm']),
                'land_size_sqm': float(house['land_size_sqm']),
                'price': float(house['price']),
                'category': house['category']
            })
        
        return jsonify({'success': True, 'results': results})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/predict-price', methods=['POST'])
def predict_price():
    try:
        data = request.json
        bedrooms = float(data['bedrooms'])
        bathrooms = float(data['bathrooms'])
        car_spaces = float(data['car_spaces'])
        floor_area = float(data['floor_area_sqm'])
        land_size = float(data['land_size_sqm'])
        years = int(data['years'])
        growth_rate = float(data.get('growth_rate', 0.05))
        
        # Predict current price
        house_features = pd.DataFrame([[bedrooms, bathrooms, car_spaces, floor_area, land_size]], 
                                      columns=features)
        current_price = price_model.predict(house_features)[0]
        
        # Calculate future price
        future_price = current_price * ((1 + growth_rate) ** years)
        appreciation = ((future_price - current_price) / current_price) * 100
        
        return jsonify({
            'success': True,
            'current_price': float(current_price),
            'future_price': float(future_price),
            'years': years,
            'growth_rate': growth_rate,
            'appreciation': float(appreciation)
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get-categories', methods=['GET'])
def get_categories():
    try:
        categories = df['category'].unique().tolist()
        return jsonify({'success': True, 'categories': categories})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)