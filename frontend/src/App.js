import React, { useState } from "react";
import './App.css';

function App() {
  const [formData,setFormData]=useState({
    no_of_dependents:"",
    education:"",
    self_employed:"",
    income_annum:"",
    loan_amount:"",
    loan_term:"",
    cibil_score:"",
    residential_assets_value:"",
    commercial_assets_value:"",
    luxury_assests_value:"",
    bank_asset_value:"",
  });

  const [loanStatus,setLoanStatus]=useState("");
  const [errorMessage,setErrorMessage]=useState("");

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData({ ...formData, [name]: value});
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoanStatus("");
    setErrorMessage("");

    try{

      const response = await fetch("http://127.0.0.1:5000/predict",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formData),
      });

      if(!response.ok){
        const errorData=await response.json();
        throw new Error(errorData.message || "Failed to fetch loan status.");
      }

      const data=await response.json();
      setLoanStatus(data.loan_status||"Unkown status");
    }catch(error){
      console.error("Error connecting to the backend:",error);
      setErrorMessage("An error occurred while connecting to the server. Please try again.");
    }
  };

  

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Loan Approval Prediction Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="my-label">No of Dependents:</label>
          <input type="number" name="no_of_dependents" value={formData.no_of_dependents} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Education:</label>
          <input type="number" name="education" value={formData.education} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Self Employed(1 for Yes,0 for No):</label>
          <input type="number" name="self_employed" value={formData.self_employed} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Income (Annually):</label>
          <input type="number" name="income_annum" value={formData.income_annum} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Loan Amount:</label>
          <input type="number" name="loan_amount" value={formData.loan_amount} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Loan Term (in months):</label>
          <input type="number" name="loan_term" value={formData.loan_term} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">CIBIL Score:</label>
          <input type="number" name="cibil_score" value={formData.cibil_score} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Residential Assets Value:</label>
          <input type="number" name="residential_assets_value" value={formData.residential_assets_value} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Commercial Assets Value:</label>
          <input type="number" name="commercial_assets_value" value={formData.commercial_assets_value} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Luxury Assests Value:</label>
          <input type="number" name="luxury_assests_value" value={formData.luxury_assests_value} onChange={handleChange} required/>
        </div>
        <div>
          <label className="my-label">Bank Asset Value:</label>
          <input type="number" name="bank_asset_value" value={formData.bank_asset_value} onChange={handleChange} required/>
        </div>

        <button type="submit" className="my-button">Predict Loan Status</button>
        {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
        {loanStatus && <h3>Loan Status: {loanStatus}</h3>}
      </form>
    </div>
  );
}

export default App;
