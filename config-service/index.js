const express = require('express');
const mysql = require('mysql2');
const redis = require('redis');

const app = express();
const port = process.env.PORT || 8080;

app.get('/health', (_, res) => res.send('OK'));

app.get('/config', (_, res) => {
  res.json({ status: 'config-service running' });
});

app.listen(port, () => {
  console.log(`Config service running on port ${port}`);
});
