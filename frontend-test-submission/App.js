import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Tabs, 
  Tab, 
  Box 
} from '@mui/material';
import { Log } from '../logging-middleware/logger.browser.js';
import URLShortenerPage from './URLShortenerPage';
import StatisticsPage from './StatisticsPage';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    Log("frontend", "info", "navigation", `Switched to tab: ${newValue === 0 ? 'URL Shortener' : 'Statistics'}`);
    setTabValue(newValue);
  };

  React.useEffect(() => {
    Log("frontend", "info", "app", "URL Shortener App initialized");
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="URL Shortener" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <URLShortenerPage />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <StatisticsPage />
        </TabPanel>
      </Container>
    </div>
  );
}

export default App;


