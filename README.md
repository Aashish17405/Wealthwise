# WealthWise - Financial Advisory Platform

WealthWise is a comprehensive financial advisory platform that helps users manage their investments, track expenses, and get personalized financial advice.

## Features

- Personalised Stock, Mutual Funds and Fixed deposit recommendations
- Mutual fund insights
- AI-powered financial chatbot
- Expense tracking and management
- Virtual Investment portfolio tracking and analysis

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Pinecone account for vector database
- Groq API key for AI capabilities
- Firebase account for authentication

## Installation

### Clone the Repository

```bash
git clone https://github.com/Aashish17405/Wealthwise
cd Wealthwise
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory using the provided `.env.example` as a template:

```bash
cp .env.example .env
```

4. Update the `.env` file with your actual credentials.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory using the provided `.env.example` as a template:

```bash
cp .env.example .env
```

4. Update the `.env` file with your actual credentials.

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on port 5001.

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend development server will start on port 3000.

## Project Structure

- `backend/`: Contains the Express.js server code
  - `models/`: Database schemas
  - `routes/`: API routes
  - `index.js`: Main server file
- `frontend/`: Contains the React.js application
  - `src/`: Source code
    - `components/`: React components
    - `App.js`: Main application component

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Pinecone for vector database
- Groq for AI capabilities
- Firebase Admin SDK

### Frontend

- React.js
- Tailwind CSS
- Firebase Authentication
- Recharts for data visualization
- Axios for API requests


See the `.env.example` files in both the backend and frontend directories for required environment variables.

## License

[MIT](LICENSE)
