import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Link,
  Chip,
  IconButton
} from '@mui/material';
import { ContentCopy, Delete } from '@mui/icons-material';
import { Log } from '../logging-middleware/logger.browser.js';

function URLShortenerPage() {
  const [urls, setUrls] = useState([]);
  const [formData, setFormData] = useState({
    url: '',
    validity: 30,
    shortcode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!formData.url) {
      setError('URL is required');
      return false;
    }
    
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL');
      return false;
    }
    
    if (formData.validity && (isNaN(formData.validity) || formData.validity <= 0)) {
      setError('Validity must be a positive number');
      return false;
    }
    
    if (formData.shortcode && !/^[a-zA-Z0-9]{1,10}$/.test(formData.shortcode)) {
      setError('Shortcode must be alphanumeric and 1-10 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      Log("frontend", "error", "url-shortener", "Form validation failed");
      return;
    }
    
    setLoading(true);
    Log("frontend", "info", "url-shortener", "Creating short URL");
    
    try {
      const response = await fetch('http://localhost:3000/shorturls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.url,
          validity: parseInt(formData.validity) || 30,
          shortcode: formData.shortcode || undefined
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create short URL');
      }
      
      const newUrl = {
        id: Date.now(),
        originalUrl: formData.url,
        shortLink: data.shortLink,
        expiry: data.expiry,
        createdAt: new Date().toISOString()
      };
      
      setUrls(prev => [...prev, newUrl]);
      setSuccess('Short URL created successfully!');
      setFormData({ url: '', validity: 30, shortcode: '' });
      
      Log("frontend", "info", "url-shortener", "Short URL created successfully");
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "url-shortener", `Error creating short URL: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log("frontend", "info", "url-shortener", "Short URL copied to clipboard");
    setSuccess('Copied to clipboard!');
  };

  const removeUrl = (id) => {
    setUrls(prev => prev.filter(url => url.id !== id));
    Log("frontend", "info", "url-shortener", "URL removed from list");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create Short URL
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Original URL"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://example.com/very-long-url"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  type="number"
                  value={formData.validity}
                  onChange={(e) => handleInputChange('validity', e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  value={formData.shortcode}
                  onChange={(e) => handleInputChange('shortcode', e.target.value)}
                  placeholder="e.g., mylink"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || urls.length >= 5}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {loading ? 'Creating...' : 'Create Short URL'}
                </Button>
                {urls.length >= 5 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Maximum 5 URLs can be shortened simultaneously
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {urls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Short URLs ({urls.length}/5)
            </Typography>
            
            {urls.map((url) => (
              <Card key={url.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Original URL:
                      </Typography>
                      <Link href={url.originalUrl} target="_blank" rel="noopener" sx={{ wordBreak: 'break-all' }}>
                        {url.originalUrl}
                      </Link>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                        Short URL:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Link href={url.shortLink} target="_blank" rel="noopener">
                          {url.shortLink}
                        </Link>
                        <IconButton size="small" onClick={() => copyToClipboard(url.shortLink)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Expires: ${new Date(url.expiry).toLocaleString()}`} 
                          size="small" 
                          color="warning"
                        />
                        <Chip 
                          label={`Created: ${new Date(url.createdAt).toLocaleString()}`} 
                          size="small" 
                        />
                      </Box>
                    </Box>
                    
                    <IconButton color="error" onClick={() => removeUrl(url.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default URLShortenerPage;
