const express = require('express');
const path = require('path');
const os = require('os');
const si = require('systeminformation');
const axios = require('axios');  // Import axios untuk mendapatkan IP publik

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch system data
app.get('/api/system', async (req, res) => {
  try {
    // Ambil data sistem seperti CPU, Memory, OS, Disk
    const cpu = await si.cpu();
    const memory = await si.mem();
    const osInfo = await si.osInfo();
    const disk = await si.diskLayout();

    // Mendapatkan IP lokal
    const networkInterfaces = os.networkInterfaces();
    const localIP = networkInterfaces['eth0'] ? networkInterfaces['eth0'][0].address : 'Not available'; // bisa disesuaikan dengan interface yang digunakan

    // Mendapatkan IP publik melalui API eksternal
    let publicIP = 'Loading...';
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      publicIP = response.data.ip;
    } catch (error) {
      publicIP = 'Unable to fetch public IP';
    }

    // Menggabungkan data yang didapat
    const systemData = {
      cpu: cpu,
      memory: memory,
      os: osInfo,
      disk: disk,
      localIP: localIP,
      publicIP: publicIP
    };

    res.json(systemData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch system data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
