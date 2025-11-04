# Full-Stack Breast Cancer Classifier

This project is a full-stack web application that uses a machine learning ensemble model to classify breast tumors as benign or malignant based on 30 diagnostic features.

The frontend is built with **React** and **TypeScript**, providing a modern, interactive user interface. The backend is a **Python/Flask** RESTful API that serves the trained **Scikit-learn** model, processes incoming data, and returns real-time predictions.

## 🌟 Key Features

  * **Interactive UI:** A clean React frontend to input 30 tumor features.
  * **Robust API:** A Flask backend API that serves the trained ML model.
  * **Ensemble Model:** Uses a Scikit-learn `VotingClassifier` (combining Logistic Regression, SVM, and a Decision Tree) for high-accuracy predictions.
  * **Real-time Analysis:** Instantly returns a "Benign" or "Malignant" classification along with the model's confidence score.
  * **Data Preprocessing:** The API uses a saved `StandardScaler` to process new data exactly as the model was trained.

## 🛠 Tech Stack

  * **Frontend:** React, TypeScript, Vite, Shadcn UI
  * **Backend:** Python, Flask, Flask-CORS
  * **Machine Learning:** Scikit-learn, Pandas, NumPy, Joblib
  * **Data Source:** UCI Breast Cancer Wisconsin (Diagnostic) Dataset

## 📁 Project Structure

```
/breast-cancer-classifier
├── /frontend           # React/Vite Frontend
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── app.py              # Flask API server
├── ensemble_model.pkl  # Saved ensemble model
├── scaler.pkl          # Saved data scaler
└── requirements.txt    # Python dependencies
```

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

You must have the following software installed:

  * [Python 3.10+](https://www.python.org/downloads/)
  * [Node.js & npm](https://nodejs.org/en) (LTS version recommended)
  * [Git](https://www.google.com/search?q=https://git-scm.com/downloads)

### 1\. Clone the Repository

```bash
git clone https://your-repository-url/breast-cancer-classifier.git
cd breast-cancer-classifier
```

### 2\. Backend Setup (Flask API)

1.  **Open a terminal** and navigate to the project's root directory.
2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
3.  **Activate the virtual environment:**
      * **Windows (Command Prompt):** `.\venv\Scripts\activate`
      * **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
      * **macOS/Linux:** `source venv/bin/activate`
4.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run the Flask API:**
    ```bash
    python app.py
    ```
    The backend server will start running on `http://127.0.0.1:5000`.

### 3\. Frontend Setup (React App)

1.  **Open a new, separate terminal.**
2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
3.  **Install npm dependencies:**
    ```bash
    npm install
    ```
4.  **Run the React development server:**
    ```bash
    npm run dev
    ```
    The frontend application will start running on `http://localhost:8080/` (or a similar port).

## 🖥️ Usage

1.  Make sure both the **backend** and **frontend** servers are running in their respective terminals.
2.  Open your web browser and go to `http://localhost:8080/`.
3.  The web page will display 30 input fields.
4.  Enter the 30 tumor features into the form.
5.  Click the **"Predict"** (or "Analyze") button.
6.  The app will display the prediction ("Benign" or "Malignant") and the model's confidence score, received live from the Flask API.

## 🌐 API Endpoint

The Flask server exposes the following endpoint:

### `POST /predict`

This endpoint receives the 30 features and returns a classification.

**Request Body (JSON):**

```json
{
  "features": [
    17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
    1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
    25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
  ]
}
```

**Response Body (JSON):**

```json
{
  "prediction": "Malignant",
  "prediction_class": 0,
  "confidence_benign": 0.002,
  "confidence_malignant": 0.998
}
```

## 📈 Future Work

  * Containerize the full application (frontend and backend) using Docker and Docker Compose.
  * Deploy the application to a cloud service (e.g., Vercel for frontend, Heroku/AWS for backend).
  * Add functionality to accept feature inputs via `.csv` or `.txt` file upload.
