const path = require('path');
const liveServer = require('live-server');
const uuidv5 = require('uuid').v5;

const MOUNT = '/demo';
const REPORT_INDEX = path.normalize(
  path.join(__dirname, '..', 'www', 'cronkite', 'examples', 'data'),
);

const params = {
  port: 1234, // Set the server port. Defaults to 8080.
  host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root: path.normalize(path.join(__dirname, '..', 'src', 'testData')), // Set root directory that's being served. Defaults to cwd.
  open: false, // When false, it won't load your browser by default.
  wait: 100, // Waits for all changes, before reloading. Defaults to 0 sec.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  cors: true,
  mount: [[MOUNT, REPORT_INDEX]],
  middleware: [
    (req, res, next) => {
      // console.info({req, res})
      res.setHeader('Access-Control-Expose-Headers', 'ETag');
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    },
  ],
};
liveServer.start(params);
