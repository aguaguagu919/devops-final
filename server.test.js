const { handle } = require('./server');

async function get(path) {
  const res = { writeHead: jest.fn(), end: jest.fn() };
  await handle({ method: 'GET', url: path }, res);
  return res;
}

test('GET / returns the project title', async () => {
  const res = await get('/');
  expect(res.writeHead.mock.calls[0][0]).toBe(200);
  expect(res.end).toHaveBeenCalledWith('DevOps Final Project');
});

test('GET /health returns a JSON status', async () => {
  const res = await get('/health');
  expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
  expect(JSON.parse(res.end.mock.calls[0][0])).toEqual({ status: 'ok' });
});

test('GET /metrics exposes runtime metrics and the request counter', async () => {
  await get('/health');
  const res = await get('/metrics');
  const body = res.end.mock.calls[0][0];
  expect(body).toContain('process_cpu_user_seconds_total');
  expect(body).toMatch(/http_requests_total\{route="\/health"\} [1-9]/);
});
