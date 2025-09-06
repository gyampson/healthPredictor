import { useState } from "react";
import { Info, Heart, Activity, User, TrendingUp } from "lucide-react";
import "./App.css";

function App() {
  const initialData = {
    age: 50, sex: 0, trestbps: 120, chol: 200, thalach: 150,
    oldpeak: 1.0, cp: 0, fbs: 0, restecg: 0, exang: 0,
    slope: 2, ca: 0, thal: 2
  };

  const [formData, setFormData] = useState(initialData);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://healthpredictorbackend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPrediction(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error predicting. Check backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const getColor = (category) => {
    switch(category) {
      case "Healthy": return "#10B981";
      case "Mild Risk": return "#F59E0B";
      case "At Risk": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const tooltips = {
    age: "Your current age in years. Age is a significant risk factor for heart disease.",
    sex: "Biological sex. Males typically have higher risk of heart disease at younger ages.",
    trestbps: "Resting blood pressure in mm Hg. Normal range is typically 90-120 mm Hg.",
    chol: "Serum cholesterol level in mg/dl. Levels above 240 mg/dl are considered high.",
    thalach: "Maximum heart rate achieved during exercise. Higher values are generally better.",
    oldpeak: "ST depression induced by exercise. Higher values may indicate heart problems.",
    cp: "Type of chest pain experienced. Different types have varying associations with heart disease.",
    fbs: "Fasting blood sugar level. Values >120 mg/dl may indicate diabetes risk.",
    restecg: "Resting electrocardiographic results showing heart rhythm abnormalities.",
    exang: "Exercise-induced angina (chest pain). May indicate restricted blood flow to heart.",
    slope: "The slope of the peak exercise ST segment on ECG.",
    ca: "Number of major coronary arteries with significant blockage (0-4).",
    thal: "Thalassemia test results indicating blood flow to the heart muscle."
  };

  const CircularProgress = ({ percentage, color }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
            className="progress-bg"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="progress-bar"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="progress-text">
          <span className="progress-number">{percentage}</span>
          <span className="progress-label">Score</span>
        </div>
      </div>
    );
  };

  const Tooltip = ({ id, content, children }) => (
    <div className="tooltip-container">
      {children}
      <button
        className="tooltip-trigger"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
        onFocus={() => setActiveTooltip(id)}
        onBlur={() => setActiveTooltip(null)}
        aria-label={`Information about ${id}`}
      >
        <Info size={16} />
      </button>
      {activeTooltip === id && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <div className="background-gradient"></div>
      
      <div className="container">
        <header className="header">
          <div className="header-content">
            <Heart className="header-icon" />
            <h1 className="header-title">Smart Health Predictor</h1>
            <p className="header-subtitle">AI-powered cardiovascular risk assessment</p>
          </div>
        </header>

        <div className="main-content">
          <div className="form-section">
            <div className="card">
              <div className="card-header">
                <User className="card-icon" />
                <h2>Patient Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                  <div className="form-group">
                    <Tooltip id="age" content={tooltips.age}>
                      <label className="form-label">Age: {formData.age}</label>
                    </Tooltip>
                    <input 
                      type="range" 
                      name="age" 
                      min="0" 
                      max="120" 
                      value={formData.age} 
                      onChange={handleChange}
                      className="range-input"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip id="sex" content={tooltips.sex}>
                      <label className="form-label">Sex</label>
                    </Tooltip>
                    <select name="sex" value={formData.sex} onChange={handleChange} className="select-input">
                      <option value={0}>Male</option>
                      <option value={1}>Female</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Tooltip id="trestbps" content={tooltips.trestbps}>
                      <label className="form-label">Resting BP: {formData.trestbps} mmHg</label>
                    </Tooltip>
                    <input 
                      type="range" 
                      name="trestbps" 
                      min="80" 
                      max="200" 
                      value={formData.trestbps} 
                      onChange={handleChange}
                      className="range-input"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip id="chol" content={tooltips.chol}>
                      <label className="form-label">Cholesterol: {formData.chol} mg/dl</label>
                    </Tooltip>
                    <input 
                      type="range" 
                      name="chol" 
                      min="100" 
                      max="400" 
                      value={formData.chol} 
                      onChange={handleChange}
                      className="range-input"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip id="thalach" content={tooltips.thalach}>
                      <label className="form-label">Max Heart Rate: {formData.thalach} bpm</label>
                    </Tooltip>
                    <input 
                      type="range" 
                      name="thalach" 
                      min="60" 
                      max="220" 
                      value={formData.thalach} 
                      onChange={handleChange}
                      className="range-input"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip id="oldpeak" content={tooltips.oldpeak}>
                      <label className="form-label">ST Depression: {formData.oldpeak}</label>
                    </Tooltip>
                    <input 
                      type="range" 
                      name="oldpeak" 
                      min="0" 
                      max="10" 
                      step="0.1" 
                      value={formData.oldpeak} 
                      onChange={handleChange}
                      className="range-input"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip id="cp" content={tooltips.cp}>
                      <label className="form-label">Chest Pain Type</label>
                    </Tooltip>
                    <select name="cp" value={formData.cp} onChange={handleChange} className="select-input">
                      <option value={0}>Typical Angina</option>
                      <option value={1}>Atypical Angina</option>
                      <option value={2}>Non-anginal Pain</option>
                      <option value={3}>Asymptomatic</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Tooltip id="fbs" content={tooltips.fbs}>
                      <label className="form-label">Fasting Blood Sugar</label>
                    </Tooltip>
                    <select name="fbs" value={formData.fbs} onChange={handleChange} className="select-input">
                      <option value={0}>≤120 mg/dl</option>
                      <option value={1}>&gt;120 mg/dl</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Tooltip id="restecg" content={tooltips.restecg}>
                      <label className="form-label">Resting ECG</label>
                    </Tooltip>
                    <select name="restecg" value={formData.restecg} onChange={handleChange} className="select-input">
                      <option value={0}>Normal</option>
                      <option value={1}>ST-T Abnormality</option>
                      <option value={2}>Left Ventricular Hypertrophy</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Tooltip id="exang" content={tooltips.exang}>
                      <label className="form-label">Exercise Induced Angina</label>
                    </Tooltip>
                    <select name="exang" value={formData.exang} onChange={handleChange} className="select-input">
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Tooltip id="slope" content={tooltips.slope}>
                      <label className="form-label">ST Slope</label>
                    </Tooltip>
                    <select name="slope" value={formData.slope} onChange={handleChange} className="select-input">
                      <option value={0}>Upsloping</option>
                      <option value={1}>Flat</option>
                      <option value={2}>Downsloping</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Tooltip id="ca" content={tooltips.ca}>
                      <label className="form-label">Major Vessels: {formData.ca}</label>
                    </Tooltip>
                    <input 
                      type="range" 
                      name="ca" 
                      min="0" 
                      max="4" 
                      value={formData.ca} 
                      onChange={handleChange}
                      className="range-input"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip id="thal" content={tooltips.thal}>
                      <label className="form-label">Thalassemia</label>
                    </Tooltip>
                    <select name="thal" value={formData.thal} onChange={handleChange} className="select-input">
                      <option value={1}>Normal</option>
                      <option value={2}>Fixed Defect</option>
                      <option value={3}>Reversible Defect</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity size={20} />
                      Predict Health Risk
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="results-section">
            {prediction && (
              <div className="card results-card">
                <div className="card-header">
                  <TrendingUp className="card-icon" />
                  <h2>Health Assessment Results</h2>
                </div>
                
                <div className="results-content">
                  <div className="score-section">
                    <CircularProgress 
                      percentage={prediction["Predicted Health Score"]} 
                      color={getHealthScoreColor(prediction["Predicted Health Score"])}
                    />
                  </div>
                  
                  <div className="status-section">
                    <div className="status-label">Health Status</div>
                    <div 
                      className="status-value"
                      style={{ color: getColor(prediction["Risk Category"]) }}
                    >
                      {prediction["Risk Category"]}
                    </div>
                    
                    <div className="status-description">
                      {prediction["Risk Category"] === "Healthy" && "Your cardiovascular health appears to be in good condition. Continue maintaining healthy lifestyle habits."}
                      {prediction["Risk Category"] === "Mild Risk" && "You may have some elevated risk factors. Consider consulting with a healthcare provider for guidance."}
                      {prediction["Risk Category"] === "At Risk" && "Several risk factors detected. Please consult with a healthcare professional for proper evaluation and treatment."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="card error-card">
                <div className="error-content">
                  <h3>Error</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;