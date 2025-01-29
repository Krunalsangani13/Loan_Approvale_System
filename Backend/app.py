from flask import Flask,request,jsonify
from flask_cors import CORS
import joblib
import numpy as np

app=Flask(__name__)
CORS(app)

model=joblib.load("loan_model.pkl")
scaler=joblib.load("scaler.pkl")

@app.route('/')
def home():
    return "Welcome to the Loan Prediction API...!"

@app.route('/predict', methods=['POST'])
def predict():
    data=request.json
    try:
        features=np.array([[
            data['no_of_dependents'],
            data['education'],
            data['self_employed'],
            data['income_annum'],
            data['loan_amount'],
            data['loan_term'],
            data['cibil_score'],
            data['residential_assets_value'],
            data['commercial_assets_value'],
            data['luxury_assets_value'],
            data['bank_asset_value']
        ]])

        features_scaled=scaler.transform(features)
        prediction=model.predict(features_scaled)[0]
        result="Approved" if prediction == 1 else "Rejected"
        
        return jsonify({'loan_status':result})
    except Exception as e:
        return jsonify({"error":str(e)})

if __name__ == '__main__':
    app.run(debug=True)