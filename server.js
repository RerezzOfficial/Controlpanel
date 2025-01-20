const express = require('express');
const path = require('path');
const si = require('systeminformation');  // Untuk mengambil info sistem (lokal VPS)
const axios = require('axios');  // Untuk mendapatkan IP publik (dari layanan eksternal)
const os = require('os');  // Untuk mengambil informasi IP lokal

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk mengambil data VPS berdasarkan IP yang diberikan
app.get('/api/system/:ip', async (req, res) => {
  const vpsIp = req.params.ip;

  try {
    // Mendapatkan informasi dasar sistem
    const cpu = await si.cpu();
    const memory = await si.mem();
    const osInfo = await si.osInfo();
    const disk = await si.diskLayout();

    // Mendapatkan IP lokal
    const networkInterfaces = os.networkInterfaces();
    const localIP = networkInterfaces['eth0'] ? networkInterfaces['eth0'][0].address : 'Not available';

    // Mendapatkan IP publik
    let publicIP = 'Loading...';
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      publicIP = response.data.ip;
    } catch (error) {
      publicIP = 'Unable to fetch public IP';
    }

    // Simulasikan data VPS berdasarkan IP yang dimasukkan
    const systemData = {
      cpu: cpu.manufacturer + ' ' + cpu.speed + ' GHz',
      memory: (memory.total / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
      os: osInfo.distro + ' ' + osInfo.release,
      disk: disk[0].size / (1024 * 1024 * 1024) + ' GB',
      localIP: localIP,
      publicIP: publicIP
    };

    // Kembalikan data sistem
    res.json(systemData);

  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch system data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
