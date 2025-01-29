import React, { useState } from "react";
import './App.css'

function Loan() {
  const [formData, setFormData] = useState({
    no_of_dependents: "",
    education: "",
    self_employed: "",
    income_annum: "",
    loan_amount: "",
    loan_term: "",
    cibil_score: "",
    residential_assets_value: "",
    commercial_assets_value: "",
    luxury_assets_value: "",
    bank_asset_value: "",
  });

  const [loanStatus, setLoanStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoanStatus("");
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch loan status.");
      }

      const data = await response.json();
      setLoanStatus(data.loan_status || "Unknown status");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please check your input and try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Loan Approval Prediction</h2>
      <h4 className="text-2xl font-semibold mb-4">in education & self_employed(1 for YES and 0 for NO)</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="my-label">{key.replace(/_/g, " ")}:</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        ))}
        <button type="submit" className="my-button">
          Predict Loan Status
        </button>
      </form>
      {errorMessage && <p className="mt-3 text-red-500">{errorMessage}</p>}
      {loanStatus && <h3 className="mt-3 text-lg font-semibold">Loan Status: {loanStatus}</h3>}
    </div>
  );
}

export default Loan;
