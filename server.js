const express = require('express');
const path = require('path');
const os = require('os');
const si = require('systeminformation');

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch system data
app.get('/api/system', async (req, res) => {
  try {
    const cpu = await si.cpu();
    const memory = await si.mem();
    const osInfo = await si.osInfo();
    const disk = await si.diskLayout();
    
    const systemData = {
      cpu: cpu,
      memory: memory,
      os: osInfo,
      disk: disk
    };
    res.json(systemData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch system data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
