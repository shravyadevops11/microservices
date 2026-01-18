const express = require('express');

const app = express();
const port = process.env.PORT || 8081;

app.get('/health', (_, res) => res.send('OK'));

app.get('/logs', (_, res) => {
  res.json({ status: 'log-aggregator running' });
});

app.listen(port, () => {
  console.log(`Log Aggregator running on port ${port}`);
});
