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
    data=request.get_json()
    try:
       
        features=np.array([
        data.get("no_of_dependents",0),
        data.get("education",0),
        data.get("self_employed",0),
        data.get("income_annum",0),
        data.get("loan_amount",0),
        data.get("loan_term",0),
        data.get("cibil_score",0),
        data.get("residential_assets_value",0),
        data.get("commercial_assets_value",0),
        data.get("luxury_assets_value",0),
        data.get("bank_asset_value",0)
        ],dtype=float).reshape(1,-1)

        if data["income_annum"]==0:
            return jsonify({"loan_status":"Rejected due to Zero income"}),400

        total_assets=(
            data.get("residential_assets_value",0)+
            data.get("commercial_assets_value",0)+
            data.get("bank_asset_value",0)+
            data.get("luxury_assets_value",0)+
            data.get("income_annum",0)
        )

        if data["loan_amount"]>total_assets:
            return jsonify({"loan_status":"Rejected due to insufficient collateral"})
        

        features_scaled=scaler.transform(features)
        prediction=model.predict(features_scaled)
        loan_status="Approved" if prediction[0]==1 else "Rejected"
        
        return jsonify({'loan_status':loan_status})
    except Exception as e:
        return jsonify({"error":str(e)}),500

if __name__ == '__main__':
    app.run(debug=True)
