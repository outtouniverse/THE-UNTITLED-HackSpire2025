# Emotion Companion AI

An AI-powered full-stack application facilitating emotional support through interactive character-based chat and personalized task suggestions.

## ✨ Key Features

*   Interactive AI Characters aligned with different emotional states.
*   Dynamic, conversation-contextual task generation using Google Gemini.
*   Secure user authentication.
*   History tracking for chat sessions and suggested tasks.

## 📦 Technologies

**Frontend:** React, React Router DOM, Axios

**Backend (Node.js/Express):** Express.js, Mongoose (MongoDB ODM), Axios

**ML Service (Python/Flask):** Flask, Flask-CORS, Google Generative AI

**Database:** MongoDB

## 🚀 Getting Started

### Prerequisites

*   Node.js & npm/yarn
*   Python 3.7+ & pip
*   MongoDB instance (local or cloud)
*   Google Cloud Project & Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  **Backend (Node.js) Setup:**
    ```bash
    cd backend/my-app
    npm install # or yarn install
    ```
    Create a `.env` file:
    ```env
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    # Add other backend env vars
    ```
3.  **ML Service (Python) Setup:**
    ```bash
    cd ../ml-service
    pip install -r requirements.txt # or install dependencies manually (Flask, Flask-Cors, google-generativeai, python-dotenv)
    ```
    Create a `.env` file:
    ```env
    GEMINI_API_KEY=<your_google_gemini_api_key>
    ```
4.  **Frontend (React) Setup:**
    ```bash
    cd ../../client-new
    npm install # or yarn install
    ```
    Verify or update `API_URL` in frontend source files (e.g., `ChatCanvas.jsx`) to point to your Node.js backend (`http://localhost:3001` by default).

### Running

1.  Start your MongoDB server.
2.  Start the Python ML Service:
    ```bash
    cd backend/my-app/ml-service
    python app.py
    ```
3.  Start the Node.js Backend:
    ```bash
    cd backend/my-app
    npm start # or yarn start
    ```
4.  Start the React Frontend:
    ```bash
    cd client-new
    npm start # or yarn start
    ```

Access the application in your browser, usually at `http://localhost:3000`.

## 📁 Project Structure
