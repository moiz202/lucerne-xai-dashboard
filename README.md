# LUCERNE – Explainable AI Dashboard (FYP)

Lucerne is an interactive Explainable AI (XAI) dashboard developed for breast cancer prediction using SHAP and LIME. The system aims to make machine learning predictions more transparent and easier to understand, supporting safer and more informed decision-making in a healthcare context.

---

## 🔍 Features

* Predict tumour type (Benign or Malignant)
* Display model confidence score
* Highlight top influencing features for each prediction
* Global explanation using SHAP
* Local explanation using LIME
* Interactive visualisations using charts
* Smooth user experience with AI processing indicators

---

## 🧠 Technologies Used

**Frontend**

* React (JavaScript)
* Recharts (Data Visualisation)

**Backend**

* Flask (Python)
* Scikit-learn (Random Forest Classifier)
* SHAP and LIME (Explainable AI techniques)

---

## ⚙️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/moiz202/lucerne-xai-dashboard.git
cd lucerne-xai-dashboard
```

---

### 2. Setup Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python app.py
```

---

### 3. Setup Frontend (Open a New Terminal)

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Open in Browser

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
lucerne-xai-dashboard/
│── backend/        # Flask API and ML model
│── frontend/       # React user interface
│── README.md
```

---

## ⚠️ Disclaimer

This system is designed for educational and decision-support purposes only.
It does not provide medical diagnosis and must not replace professional clinical judgement.

---

## 🎓 Author

Moiaz Amir
BSc Computer Science
University of Roehampton
Final Year Project (FYP)
