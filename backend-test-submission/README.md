# Backend - URL Shortener Microservice

Express.js microservice providing URL shortening functionality with analytics.

## Features
- Create shortened URLs with custom or auto-generated shortcodes
- Configurable validity periods (default: 30 minutes)
- Click tracking and analytics
- RESTful API with comprehensive error handling
- CORS enabled for frontend integration
- Extensive logging integration

## API Endpoints

### POST /shorturls
Create shortened URL
- **Request**: `{ url: string, validity?: number, shortcode?: string }`
- **Response**: `{ shortLink: string, expiry: string }`

### GET /:shortcode
Redirect to original URL (with analytics tracking)

### GET /shorturls/:shortcode  
Get detailed statistics for a shortened URL

### GET /shorturls
List all shortened URLs with basic statistics

### GET /test
Health check endpoint

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Server runs on http://localhost:3000

## Dependencies
- express: Web framework
- cors: Cross-origin resource sharing
- axios: HTTP client (for logging middleware)

## Storage
- In-memory storage for URLs and analytics
- Production deployment would use a database (MongoDB, PostgreSQL, etc.)

## Logging
All operations are logged using custom middleware that sends logs to the evaluation service.
