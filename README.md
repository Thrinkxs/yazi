# Yazi Assessment Application

A full-stack application that authenticates with AWS Cognito, fetches survey campaign data from backend endpoints, displays results on an Angular frontend, and exports data as downloadable PowerPoint reports.

## Architecture

- **Frontend**: Angular 21 (standalone components) running on port 4200
- **Backend**: Express.js/TypeScript proxy server running on port 3001
- **Authentication**: AWS Cognito (User Pool in eu-west-2)
- **External API**: api-dev.askyazi.co (accessed via backend proxy)

## Features

1. **AWS Cognito Authentication**
   - Login screen with prefilled test credentials
   - ID token stored in localStorage
   - Token automatically sent with all API requests

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

# Create .env file (if not exists)
# Add your MongoDB connection string and other configs

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
3. Test credentials are prefilled:
   - Email: `assessment@test.com`
   - Password: `TestPass123!`
4. Click "Sign in" to authenticate with Cognito
5. After successful login, you'll see the Campaign Overview
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

## Project Structure

### Frontend (`/frontend`)

```
src/app/
├── services/
│   ├── auth.service.ts       # Cognito authentication
│   └── api.service.ts        # Calls backend proxy endpoints
├── guards/
│   └── auth.guard.ts         # Route protection (currently unused)
├── login.component.*         # Login screen
├── campaign.component.*      # Campaign overview
├── survey.component.*        # Survey results + export
├── app.routes.ts             # Route configuration
└── app.html                  # App shell with header
```

### Backend (`/backend`)

```
src/
├── api/
│   ├── controller/
│   │   └── proxy.controller.ts   # Forwards requests to external API
│   └── routes/
│       └── proxy.route.ts        # /api/proxy/* routes
└── index.ts                      # Express app + CORS config
```

## Configuration

### Cognito Settings (Frontend)

Located in `frontend/src/app/services/auth.service.ts`:

```typescript
const REGION = 'eu-west-2';
const USER_POOL_ID = 'eu-west-2_F1iE2nIn2';
const APP_CLIENT_ID = '24lksgnsv0h63jvkkpvhovmk33';
```

### API Endpoints (Backend Proxy)

Located in `backend/src/api/controller/proxy.controller.ts`:

```typescript
const EXTERNAL_API_BASE = "https://api-dev.askyazi.co";
```

All requests to `http://localhost:3001/api/proxy/*` are forwarded to `https://api-dev.askyazi.co/*`

## Test Credentials

- **Email**: assessment@test.com
- **Password**: TestPass123!
- **Campaign ID**: e30feb20-a7ce-44c1-a312-a977e867d7ad

## Available Endpoints (via Proxy)

1. **GET** `/api/proxy/campaigns/{campaignId}`
   - Returns: Campaign details and questions

2. **GET** `/api/proxy/campaigns/{campaignId}/survey-graph-results`
   - Returns: Survey results with distribution data

3. **POST** `/api/proxy/powerpoint-report`
   - Body: PowerPointRequest
   - Returns: { fileName, status }

4. **GET** `/api/proxy/powerpoint-status?filename={fileName}`
   - Returns: { downloadUrl, status } when ready

## Troubleshooting

### White Screen / Blank Page

- Check browser console for errors
- Verify both backend (port 3001) and frontend (port 4200) are running
- Hard refresh browser (Ctrl+F5)

### Authentication Errors

- Verify Cognito credentials in `auth.service.ts`
- Check network tab for InitiateAuth request
- Ensure ID token is stored in localStorage (key: `yazi_id_token`)

### API Request Failures

- Verify backend is running on port 3001
- Check backend console for proxy errors
- Ensure Authorization header contains valid ID token
- Test external API directly: https://api-dev.askyazi.co

### CORS Errors

- Verify `http://localhost:4200` is in backend's `allowedOrigins`
- Check backend CORS configuration in `src/index.ts`

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the Angular app:
```powershell
cd frontend
npm run build
```

2. Deploy the `dist/frontend/browser` folder

3. Update `BASE_URL` in `api.service.ts` to point to deployed backend

### Backend Deployment (Render/Heroku)

1. Set environment variables:
   - `PORT` (default: 3001)
   - `MONGO_URI` (MongoDB connection)

2. Update `allowedOrigins` in `src/index.ts` with deployed frontend URL

3. Deploy with build command: `npm run deploy`

## Development Notes

- **No Auth Guard**: Routes are currently unprotected to avoid redirect loops. Can be re-enabled after testing.
- **TypeScript Types**: Minimal typing used for external API responses (uses `any`). Can be strengthened with proper interfaces.
- **Error Handling**: Basic error alerts in UI. Can be improved with toast notifications or error pages.
- **Polling**: PowerPoint status polling uses fixed retry count. Can be improved with exponential backoff.

## Next Steps

1. Add proper TypeScript interfaces for API responses
2. Implement logout button in header
3. Add loading spinners and better error UI
4. Enable auth guard after testing
5. Add unit tests for services and components
6. Configure environment variables for API URLs
7. Deploy to public URL

## License

Private assessment project
