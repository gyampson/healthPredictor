

# 🩺 Smart Health Predictor

A **real-time health prediction application** powered by **machine learning** and **FastAPI + React**, designed to estimate the risk of cardiovascular disease based on 13 clinical features. The app provides a **health score**, a **risk category**, and interactive visual feedback for a smooth user experience.

---

## **🌟 Features**

* Predict the probability of cardiovascular risk using a trained **LightGBM model**.
* Inputs 13 clinical features including age, blood pressure, cholesterol, and heart rate.
* Displays **Predicted Health Score** and **Health Status**:

  * **Healthy** ✅
  * **Mild Risk** ⚠️
  * **At Risk** ❌
* Interactive and animated **circular progress visualization** for health score.
* Tooltips explaining each feature for better user understanding.
* Responsive **React frontend** with smooth user interactions.
* Fast **FastAPI backend** with CORS enabled for frontend integration.

---

## **📊 ML Model Features**

| Feature  | Description                                       |
| -------- | ------------------------------------------------- |
| age      | Age of the patient (years)                        |
| sex      | Gender (0 = Male, 1 = Female)                     |
| trestbps | Resting blood pressure (mm Hg)                    |
| chol     | Serum cholesterol (mg/dl)                         |
| thalach  | Maximum heart rate achieved                       |
| oldpeak  | ST depression induced by exercise                 |
| cp       | Chest pain type (0–3)                             |
| fbs      | Fasting blood sugar > 120 mg/dl (0 = No, 1 = Yes) |
| restecg  | Resting ECG results (0–2)                         |
| exang    | Exercise induced angina (0 = No, 1 = Yes)         |
| slope    | Slope of peak ST segment (0–2)                    |
| ca       | Number of major vessels (0–4)                     |
| thal     | Thalassemia (1–3)                                 |

---

## **🚀 Installation & Setup**

### **Backend (FastAPI)**

1. Clone the repo and go to `backend/`:

```bash
git clone <>
cd backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
uvicorn main:app --reload
```

4. Test API in browser:

```
http://127.0.0.1:8000/
```

### **Frontend (React + Vite)**

1. Go to `frontend/` folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open in browser (usually `http://localhost:5173`).

---

## **🖥 Usage**

1. Open the frontend in a browser.
2. Fill in the 13 clinical features.
3. Click **Predict**.
4. The app shows:

   * **Predicted Health Score** (%)
   * **Health Status** (Healthy, Mild Risk, At Risk)

---

## **🌐 Deployment**

* Backend deployed on **Render** as a Web Service.
* Frontend deployed on **Render** as a Static Site.
* CORS enabled for smooth API integration.

---

## **💡 Future Improvements**

* Add **user authentication** for tracking personal health history.
* Implement **data visualization** for trends over time.
* Integrate **notifications** for high-risk users.
* Mobile-first design for responsive experience.

---

## **📂 Folder Structure**

```
backend/
├─ main.py
├─ requirements.txt
├─ model/
│  └─ lgbm_pipeline.pkl
frontend/
├─ src/
│  ├─ App.js
│  ├─ App.css
│  └─ ...
├─ package.json
└─ ...
```

---

## **📌 License**

gyampson License © 2025


