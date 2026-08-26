// ProEssentialsJS -- Copyright 1994-2026 Gigasoft, Inc. All rights reserved.
// Commercial product, free for commercial use under USD 250,000 annual
// revenue. See PEJS-LICENSE.md -- https://www.gigasoft.com
//
// serve.js -- a dependency-free static server, so the demo runs with nothing
// installed.
//
// It exists for one reason: the engine is a real WebAssembly file fetched at
// run time, and a browser refuses to instantiate WebAssembly from a `file://`
// page. Any static server will do; this one is here so you do not need to find
// one. It serves this folder and nothing else.
//
//     node serve.js              the default port below
//     node serve.js 8080         a port on the command line
//     PORT=8080 node serve.js    or through the environment
//
// It is not a production server and does not pretend to be. No configuration,
// no dependencies, no write path of any kind.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT) || 3000;

// Content types. A server that gets these wrong still works -- the browser
// sniffs most of them -- but it prints red console lines while doing it, and a
// red console on a first run reads as a broken product. `application/wasm` is
// the one that actually matters: without it, streaming instantiation fails.
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';

  // EVERY BROWSER REQUESTS THIS ON EVERY PAGE LOAD WITHOUT BEING TOLD TO, and
  // no repo here ships an icon. Left to fall through it becomes a 404 and a
  // logged line, so the first thing a customer evaluating the product sees in
  // their terminal is an error that is not one. 204 is "nothing here, and that
  // is fine": no file to ship, no binary in the repo, and the tab keeps the
  // blank icon it already had.
  if (rel === '/favicon.ico') { res.writeHead(204).end(); return; }

  const full = path.join(ROOT, path.normalize(rel).replace(/^[\\/]+/, ''));
  if (!full.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }

  fs.readFile(full, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found: ' + rel);
      console.log('404 ' + rel);
      return;
    }
    const type = TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream';

    ////////////////////////////////////////////////////////////////////////
    // *** RANGE REQUESTS, BECAUSE WITHOUT THEM MEDIA CANNOT SEEK. ***
    //
    // The symptom is very unlike the cause: an audio element loads, `duration`
    // reads correctly, playback is perfect -- and `seekable` is the EMPTY
    // range, so assigning `currentTime` silently clamps to 0 and the track
    // restarts. Nothing throws and nothing appears in the console.
    //
    // A response with no Content-Length is chunked, which tells a media
    // element the resource cannot be seeked. Content-Length and Accept-Ranges
    // on the plain 200 are what make it ASK; the 206 arm is the other half.
    // Every real static host does this already, so a feature built against one
    // works everywhere except a hand-written dev server that does not.
    ////////////////////////////////////////////////////////////////////////
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range) {
      let start = range[1] === '' ? NaN : Number(range[1]);
      let end = range[2] === '' ? NaN : Number(range[2]);
      // A suffix range, "bytes=-500", means the LAST 500 bytes.
      if (Number.isNaN(start)) { start = Math.max(0, buf.length - end); end = buf.length - 1; }
      if (Number.isNaN(end) || end >= buf.length) end = buf.length - 1;

      if (start > end || start >= buf.length) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + buf.length });
        res.end();
        return;
      }
      const slice = buf.subarray(start, end + 1);
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': slice.length,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.length,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      });
      res.end(slice);
      return;
    }

    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': buf.length,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    });
    res.end(buf);
  });
}).on('error', (e) => {
  // WITHOUT THIS, A BUSY PORT THROWS AN UNHANDLED 'error' EVENT and Node
  // prints fourteen lines of stack trace. Port 3000 is the most-used
  // development port there is, so this is not a rare case -- and to somebody
  // who has run the product exactly once, a stack trace is indistinguishable
  // from the product crashing.
  if (e.code === 'EADDRINUSE') {
    console.error('Port ' + PORT + ' is already in use.');
    console.error('Something else is serving on it. Stop that, or run '
                  + '`node serve.js <other-port>`.');
    process.exit(1);
  }
  throw e;
}).listen(PORT, () => {
  console.log('serving ' + ROOT);
  console.log('open http://localhost:' + PORT + '/');
});
