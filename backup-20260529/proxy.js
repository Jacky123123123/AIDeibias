/**
 * Tiny CORS proxy for ModelScope API
 * Run: node proxy.js
 * Listens on port 3099
 */

const http = require('http');
const https = require('https');

const PORT = 3099;
const TARGET = 'api-inference.modelscope.cn';

function ts() { return new Date().toISOString().slice(11, 19); }

http.createServer(function (req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-ModelScope-Async-Mode, X-ModelScope-Task-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  var body = [];
  req.on('data', function (chunk) { body.push(chunk); });
  req.on('end', function () {
    body = Buffer.concat(body);
    var bodyStr = body.length > 0 ? body.toString() : '';

    var headers = {};
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];
    if (req.headers['x-modelscope-async-mode']) headers['X-ModelScope-Async-Mode'] = req.headers['x-modelscope-async-mode'];
    if (req.headers['x-modelscope-task-type']) headers['X-ModelScope-Task-Type'] = req.headers['x-modelscope-task-type'];

    var path = '/v1' + req.url.replace('/api', '');

    console.log(ts(), '>', req.method, path);
    if (bodyStr.length > 0 && bodyStr.length < 500) {
      console.log('   body:', bodyStr);
    } else if (bodyStr.length >= 500) {
      console.log('   body:', bodyStr.slice(0, 200) + '... (' + bodyStr.length + ' chars)');
    }

    var chunks = [];
    var proxyReq = https.request({
      hostname: TARGET,
      path: path,
      method: req.method,
      headers: headers
    }, function (proxyRes) {
      proxyRes.on('data', function (c) { chunks.push(c); });
      proxyRes.on('end', function () {
        var respBody = Buffer.concat(chunks).toString();
        console.log(ts(), '<', proxyRes.statusCode, respBody.slice(0, 300));
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': proxyRes.headers['content-type'] || 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(Buffer.concat(chunks));
      });
    });

    proxyReq.on('error', function (err) {
      console.error(ts(), 'ERROR:', err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
    });

    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });
}).listen(PORT, function () {
  console.log('CORS proxy running on http://localhost:' + PORT);
  console.log('Proxying to https://' + TARGET + '/v1');
  console.log('');
});
