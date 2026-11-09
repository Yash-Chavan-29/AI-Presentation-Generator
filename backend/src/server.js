const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON and URLEncoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure temp directory exists for generated presentations and PDFs
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Serve generated files statically from the temp directory under /downloads
app.use('/downloads', express.static(tempDir));

// API Routes
app.use('/api', apiRoutes);

// Base route for status checks
app.get('/', (req, res) => {
  res.json({ status: 'healthy', message: 'AI Presentation Generator API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] Serving static downloads from ${tempDir}`);
});
