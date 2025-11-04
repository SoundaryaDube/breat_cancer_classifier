import joblib
import os
import numpy as np
from flask import Flask, request, jsonify

# 1. Initialize the Flask app
app = Flask(__name__)

# 2. Load your model and scaler
# These are loaded ONCE when the app starts, not on every request
try:
    model = joblib.load('ensemble_model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    model = None
    scaler = None

# 3. Define a prediction route
# This route will accept POST requests at the /predict URL
@app.route('/predict', methods=['POST'])
def predict():
    if not model or not scaler:
        return jsonify({'error': 'Model or scaler not loaded'}), 500

    try:
        # 4. Get data from the POST request
        # We expect JSON data with a key "features"
        # "features" should be a list of 30 numbers
        data = request.json
        features = data['features']
        
        # Check if we have 30 features
        if len(features) != 30:
            return jsonify({'error': 'Expected 30 features'}), 400

        # 5. Preprocess the data
        # Convert to 2D numpy array and scale
        features_array = np.array(features).reshape(1, -1)
        scaled_features = scaler.transform(features_array)
        
        # 6. Make prediction
        prediction = model.predict(scaled_features)
        probabilities = model.predict_proba(scaled_features)
        
        # 7. Format the response
        # Convert numpy types to standard Python types for JSON
        pred_class = int(prediction[0])
        prob_benign = float(probabilities[0][1])
        prob_malignant = float(probabilities[0][0])

        if pred_class == 1:
            result = "Benign"
        else:
            result = "Malignant"

        # Return the prediction as JSON
        return jsonify({
            'prediction': result,
            'prediction_class': pred_class,
            'confidence_benign': prob_benign,
            'confidence_malignant': prob_malignant
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 8. Run the app
if __name__ == '__main__':
    # The 'PORT' environment variable is set by Render
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
