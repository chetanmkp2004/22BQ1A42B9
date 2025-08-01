import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, Close, Refresh } from '@mui/icons-material';
import { Log } from '../logging-middleware/logger.browser.js';

function StatisticsPage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlStats, setSelectedUrlStats] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    setLoading(true);
    setError('');
    Log("frontend", "info", "statistics", "Fetching URL list");
    
    try {
      const response = await fetch('http://localhost:3000/shorturls');
      
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      
      const data = await response.json();
      setUrls(data);
      Log("frontend", "info", "statistics", `Fetched ${data.length} URLs`);
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "statistics", `Error fetching URLs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlStats = async (shortcode) => {
    Log("frontend", "info", "statistics", `Fetching detailed stats for: ${shortcode}`);
    
    try {
      const response = await fetch(`http://localhost:3000/shorturls/${shortcode}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch URL statistics');
      }
      
      const data = await response.json();
      setSelectedUrlStats(data);
      setDialogOpen(true);
      Log("frontend", "info", "statistics", `Fetched detailed stats for: ${shortcode}`);
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "statistics", `Error fetching URL stats: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUrlStats(null);
  };

  const isExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          URL Statistics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUrls}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              All Shortened URLs ({urls.length})
            </Typography>
            
            {urls.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No shortened URLs found. Create some URLs first!
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Short URL</TableCell>
                      <TableCell>Original URL</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Clicks</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urls.map((url) => (
                      <TableRow key={url.shortcode}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {url.shortcode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={url.originalUrl}
                          >
                            {url.originalUrl}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(url.expiry).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={url.totalClicks} 
                            size="small" 
                            color={url.totalClicks > 0 ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={isExpired(url.expiry) ? "Expired" : "Active"} 
                            size="small" 
                            color={isExpired(url.expiry) ? "error" : "success"}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => fetchUrlStats(url.shortcode)}
                            disabled={url.totalClicks === 0}
                            title={url.totalClicks === 0 ? "No clicks to show" : "View detailed statistics"}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Statistics Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Detailed Statistics - {selectedUrlStats?.shortcode}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedUrlStats && (
            <Box>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Original URL:</Typography>
                  <Typography variant="body1" gutterBottom sx={{ wordBreak: 'break-all' }}>
                    {selectedUrlStats.originalUrl}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                    <Chip label={`Total Clicks: ${selectedUrlStats.totalClicks}`} />
                    <Chip label={`Created: ${new Date(selectedUrlStats.createdAt).toLocaleString()}`} />
                    <Chip 
                      label={`Expires: ${new Date(selectedUrlStats.expiry).toLocaleString()}`}
                      color={isExpired(selectedUrlStats.expiry) ? "error" : "success"}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom>
                Click Details ({selectedUrlStats.clickDetails.length})
              </Typography>
              
              {selectedUrlStats.clickDetails.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No clicks recorded yet
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Referrer</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUrlStats.clickDetails.map((click, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(click.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {click.referrer === 'Direct' ? (
                              <Chip label="Direct" size="small" />
                            ) : (
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {click.referrer}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip label={click.location} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default StatisticsPage;
