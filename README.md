# Yazi Assessment Application

A full-stack application that authenticates with AWS Cognito, fetches survey campaign data from backend endpoints, displays results on an Angular frontend, and exports data as downloadable PowerPoint reports.

## Architecture

- **Frontend**: Angular 21 (standalone components) running on port 4200
- **Backend**: Express.js/TypeScript server running on port 3001
- **Authentication**: AWS Cognito (User Pool in eu-west-2)
- **External API**: api-dev.askyazi.co (accessed via backend proxy)

## Features

1. **AWS Cognito Authentication**
   - Login screen w
   - ID token stored in cookies
   - Token automatically sent with all API requests via Axios crendtials

2. **Campaign Overview**
   - Displays campaign title, type, and status
   - Lists all survey questions with their types and options

3. **Survey Results**
   - Shows aggregated response data per question
   - Visual distribution bars for each response option
   - Total participant count

4. **PowerPoint Export**
   - Generates report from survey data
   - Polls for completion status
   - Downloads file automatically when ready

## Prerequisites

- Node.js 18+ and npm
- MongoDB connection (configured in backend .env)
- Port 3001 available for backend
- Port 4200 available for frontend

## Setup Instructions

### 1. Backend Setup

```powershell
cd backend

# Install dependencies
npm install

# Run in development mode
npm run dev
```

Backend will start on http://localhost:3001

### 2. Frontend Setup

```powershell
cd frontend

# Install dependencies (includes amazon-cognito-identity-js)
npm install

# Run Angular dev server
npm start
```

Frontend will start on http://localhost:4200

### 3. Access the Application

1. Open http://localhost:4200 in your browser
2. You'll be redirected to the login page
3. Enter credentials
4. Click "Sign in" to authenticate with Cognito
5. After successful login, you'll see the Campaign Overview button
6. Click "View survey results" to see aggregated data
7. Click "Download Report" to generate and download PowerPoint

## API Flow

```
Angular Frontend (port 4200)
    ↓ (with Cognito ID token)
Backend Proxy (port 3001/api/proxy)
    ↓ (forwards token)
External API (api-dev.askyazi.co)
```

### Why Backend Proxy?

- **CORS handling**: Avoids browser CORS restrictions
- **Security**: Keeps external API URL configurable server-side
- **Error handling**: Centralized error responses
- **Future flexibility**: Easy to add caching, rate limiting, or request transformation

## License

Private assessment project
