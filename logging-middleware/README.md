# Logging Middleware

Custom logging middleware for both Node.js backend and browser frontend applications.

## Features
- Unified logging interface for frontend and backend
- Automatic log transmission to evaluation service
- Error handling and retry logic
- Structured log format with metadata

## Files

### logger.js (Backend/Node.js)
- Uses Axios for HTTP requests
- CommonJS module exports
- Designed for Express.js integration

### logger.browser.js (Frontend/Browser)
- Uses Fetch API for HTTP requests  
- ES6 module exports
- Browser-compatible implementation

## Usage

### Backend (Node.js)
```javascript
const { Log } = require('../logging-middleware/logger.js');

Log("backend", "info", "module-name", "Operation completed successfully");
```

### Frontend (React)
```javascript
import { Log } from '../logging-middleware/logger.browser.js';

Log("frontend", "info", "component-name", "User interaction logged");
```

## Log Levels
- `info`: General information
- `error`: Error conditions
- `debug`: Debug information
- `warning`: Warning messages

## Parameters
- **stack**: Application tier (`frontend` | `backend`)
- **level**: Log severity level
- **package**: Module or component name
- **message**: Log message content

## Configuration
- API endpoint: `http://20.244.56.144/evaluation-service/logs`
- Authentication: Bearer token (hardcoded from registration)
- Content-Type: `application/json`

## Error Handling
- Graceful failure if logging service is unavailable
- Console fallback for debugging
- No impact on application functionality if logging fails
