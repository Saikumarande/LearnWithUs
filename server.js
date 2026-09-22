'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 8080);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

function reply(response, status, message) {
  response.writeHead(status, {'Content-Type': 'text/plain; charset=utf-8'});
  response.end(message);
}

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) return reply(response, 405, 'Method not allowed');
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    return reply(response, 400, 'Bad request');
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(root + path.sep)) return reply(response, 403, 'Forbidden');

  fs.stat(file, (error, stats) => {
    if (error || !stats.isFile()) {
      const notFound = path.join(root, '404.html');
      response.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });
      if (request.method === 'HEAD') return response.end();
      return fs.createReadStream(notFound).on('error', () => reply(response, 404, 'Page not found')).pipe(response);
    }
    const headers = {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    response.writeHead(200, headers);
    if (request.method === 'HEAD') return response.end();
    fs.createReadStream(file).on('error', () => reply(response, 500, 'Server error')).pipe(response);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`LearnWithUs is listening on port ${port}`);
});
