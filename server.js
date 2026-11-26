const http = require('node:http');
const { Registry, Counter, collectDefaultMetrics } = require('prom-client');
const registry = new Registry();
collectDefaultMetrics({ register: registry });
const requests = new Counter({
  name: 'http_requests_total',
  help: 'Number of HTTP requests received',
  labelNames: ['route'],
  registers: [registry]
});

async function handle(req, res) {
  const route = ['/', '/health', '/metrics'].includes(req.url) ? req.url : 'other';
  requests.inc({ route });
  if (req.method === 'GET' && req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': registry.contentType });
    return res.end(await registry.metrics());
  }
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('DevOps Final Project');
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  res.writeHead(404);
  res.end();
}

if (require.main === module) {
  http.createServer(handle).listen(Number(process.env.PORT || 3000), '0.0.0.0');
}
module.exports = { handle };
