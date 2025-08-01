const express = require('express');
const cors = require('cors');
const { Log } = require("../logging-middleware/logger.js");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// In-memory storage (for simplicity - in production, use a database)
const urls = new Map();
const analytics = new Map();

// Helper function to generate unique shortcode
function generateShortcode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to validate URL format
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Create Short URL endpoint
app.post('/shorturls', (req, res) => {
  Log("backend", "info", "create-shorturl", "Create short URL request received");
  
  const { url, validity, shortcode } = req.body;
  
  // Validate required fields
  if (!url) {
    Log("backend", "error", "create-shorturl", "Missing required field: url");
    return res.status(400).json({ error: "URL is required" });
  }
  
  // Validate URL format
  if (!isValidUrl(url)) {
    Log("backend", "error", "create-shorturl", "Invalid URL format");
    return res.status(400).json({ error: "Invalid URL format" });
  }
  
  // Validate validity (should be integer if provided)
  const validityMinutes = validity !== undefined ? parseInt(validity) : 30;
  if (isNaN(validityMinutes) || validityMinutes <= 0) {
    Log("backend", "error", "create-shorturl", "Invalid validity period");
    return res.status(400).json({ error: "Validity must be a positive integer" });
  }
  
  // Generate or validate shortcode
  let finalShortcode = shortcode;
  if (finalShortcode) {
    // Validate custom shortcode format (alphanumeric, reasonable length)
    if (!/^[a-zA-Z0-9]{1,10}$/.test(finalShortcode)) {
      Log("backend", "error", "create-shorturl", "Invalid shortcode format");
      return res.status(400).json({ error: "Shortcode must be alphanumeric and 1-10 characters" });
    }
    // Check if shortcode already exists
    if (urls.has(finalShortcode)) {
      Log("backend", "error", "create-shorturl", "Shortcode collision detected");
      return res.status(409).json({ error: "Shortcode already exists" });
    }
  } else {
    // Generate unique shortcode
    do {
      finalShortcode = generateShortcode();
    } while (urls.has(finalShortcode));
  }
  
  // Calculate expiry time
  const now = new Date();
  const expiry = new Date(now.getTime() + validityMinutes * 60 * 1000);
  
  // Store URL data
  const urlData = {
    originalUrl: url,
    shortcode: finalShortcode,
    createdAt: now,
    expiry: expiry,
    clicks: 0
  };
  
  urls.set(finalShortcode, urlData);
  analytics.set(finalShortcode, []);
  
  const shortLink = `http://localhost:${PORT}/${finalShortcode}`;
  
  Log("backend", "info", "create-shorturl", `Short URL created: ${shortLink}`);
  
  res.status(201).json({
    shortLink: shortLink,
    expiry: expiry.toISOString()
  });
});

// Redirect endpoint
app.get('/:shortcode', (req, res) => {
  const shortcode = req.params.shortcode;
  Log("backend", "info", "redirect", `Redirect request for shortcode: ${shortcode}`);
  
  const urlData = urls.get(shortcode);
  
  if (!urlData) {
    Log("backend", "error", "redirect", "Shortcode not found");
    return res.status(404).json({ error: "Short URL not found" });
  }
  
  // Check if URL has expired
  if (new Date() > urlData.expiry) {
    Log("backend", "error", "redirect", "Short URL has expired");
    return res.status(410).json({ error: "Short URL has expired" });
  }
  
  // Record analytics
  const clickData = {
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'Direct',
    userAgent: req.get('User-Agent') || 'Unknown',
    // Simple geographical location (in production, use IP geolocation service)
    location: 'Unknown'
  };
  
  urlData.clicks++;
  analytics.get(shortcode).push(clickData);
  
  Log("backend", "info", "redirect", `Redirecting to: ${urlData.originalUrl}`);
  res.redirect(urlData.originalUrl);
});

// Get statistics endpoint
app.get('/shorturls/:shortcode', (req, res) => {
  const shortcode = req.params.shortcode;
  Log("backend", "info", "statistics", `Statistics request for shortcode: ${shortcode}`);
  
  const urlData = urls.get(shortcode);
  
  if (!urlData) {
    Log("backend", "error", "statistics", "Shortcode not found");
    return res.status(404).json({ error: "Short URL not found" });
  }
  
  const clickDetails = analytics.get(shortcode) || [];
  
  const statistics = {
    shortcode: shortcode,
    originalUrl: urlData.originalUrl,
    createdAt: urlData.createdAt.toISOString(),
    expiry: urlData.expiry.toISOString(),
    totalClicks: urlData.clicks,
    clickDetails: clickDetails.map(click => ({
      timestamp: click.timestamp.toISOString(),
      referrer: click.referrer,
      location: click.location
    }))
  };
  
  Log("backend", "info", "statistics", `Statistics retrieved for shortcode: ${shortcode}`);
  res.json(statistics);
});

// Get all URLs endpoint (for frontend statistics page)
app.get('/shorturls', (req, res) => {
  Log("backend", "info", "list-urls", "Request to list all short URLs");
  
  const allUrls = Array.from(urls.entries()).map(([shortcode, data]) => ({
    shortcode: shortcode,
    shortLink: `http://localhost:${PORT}/${shortcode}`,
    originalUrl: data.originalUrl,
    createdAt: data.createdAt.toISOString(),
    expiry: data.expiry.toISOString(),
    totalClicks: data.clicks
  }));
  
  Log("backend", "info", "list-urls", `Retrieved ${allUrls.length} short URLs`);
  res.json(allUrls);
});

// Test endpoint
app.get('/test', (req, res) => {
  Log("backend", "info", "route", "Test endpoint hit");
  res.json({ message: "Backend Working!" });
});

app.listen(PORT, () => {
  Log("backend", "info", "server", `Server running on port ${PORT}`);
});
