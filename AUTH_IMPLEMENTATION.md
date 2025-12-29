# Authentication Implementation

## Overview
The authentication system uses Axios for API calls and stores JWT tokens in localStorage for subsequent authenticated requests.

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## API Endpoints

### Login
**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "admin@citybuild.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### Register
**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "name": "Premier Construction Group",
  "type": "gc",
  "registration_number": "GC001234",
  "country": "US",
  "address": "789 Construction Ave, Builder City, TX 75001",
  "phone": "+1-214-555-0100",
  "email": "info@premierconstruction.com",
  "website": "https://premierconstruction.com"
}
```

**Organization Types:**
- `gc` - General Contractor
- `subcontractor` - Subcontractor
- `supplier` - Supplier
- `bank` - Bank
- `admin` - Admin

## Token Management

### Storage
Tokens are automatically stored in localStorage:
- `access_token` - Used for authenticating API requests
- `refresh_token` - Used to get new access tokens
- `token_type` - "bearer"
- `expires_in` - Token expiration time in seconds

### Usage
All authenticated API calls automatically include the Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

## API Client Methods

### Authentication
```typescript
// Login
const response = await api.login(email, password);

// Register
const response = await api.register(organizationData);

// Logout
await api.logout();

// Refresh token
const response = await api.refreshToken();

// Get stored tokens
const tokens = api.getStoredTokens();
```

### HTTP Methods
```typescript
// GET
const data = await api.get('/endpoint');

// POST
const data = await api.post('/endpoint', payload);

// PUT
const data = await api.put('/endpoint', payload);

// PATCH
const data = await api.patch('/endpoint', payload);

// DELETE
const data = await api.delete('/endpoint');

// File Upload
const data = await api.uploadFile('/endpoint', file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

## Error Handling

### 401 Unauthorized
When a 401 error is received:
1. All tokens are cleared from localStorage
2. User is redirected to the home page

### Generic Errors
Errors are caught and displayed in the UI with appropriate error messages from the backend.

## UI Components

### LoginForm
- Collects email and password
- Stores tokens on successful login
- Redirects to dashboard

### RegisterForm
- Collects organization details
- Stores tokens on successful registration
- Redirects to dashboard

### SlidePanel
- Smooth animation from right side
- Contains either LoginForm or RegisterForm
- Can switch between login and registration
