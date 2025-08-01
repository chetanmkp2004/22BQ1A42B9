# Frontend - URL Shortener React App

Modern React application with Material-UI for URL shortening and analytics.

## Features
- URL shortening interface (up to 5 concurrent URLs)
- Input validation and error handling
- Real-time statistics dashboard
- Detailed click analytics
- Responsive Material-UI design
- Copy-to-clipboard functionality
- Automatic URL expiry tracking

## Pages

### URL Shortener Page
- Create shortened URLs with custom shortcodes
- Set validity periods (in minutes)
- View created URLs with expiry information
- Copy short URLs to clipboard
- Remove URLs from current session

### Statistics Page  
- View all shortened URLs in a table
- See click counts and status (Active/Expired)
- Detailed analytics for individual URLs
- Click history with timestamps and referrers
- Refresh functionality for real-time updates

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open browser to http://localhost:1234

## Dependencies
- react: UI framework
- @mui/material: Material-UI components
- @mui/icons-material: Material-UI icons
- @emotion/react & @emotion/styled: Material-UI styling

## Integration
- Connects to backend API at http://localhost:3000
- Uses custom browser-compatible logging middleware
- Validates inputs client-side before API calls

## Responsive Design
- Works on desktop and mobile devices
- Material-UI responsive breakpoints
- Optimized user experience across screen sizes
cd