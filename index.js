var FS   = require('fs');
var Path = require('path');
var camelCase = require('camel-case');

module.exports = function (dir, opts) {
  opts = opts || {};

  var requires = {};

  if (arguments.length === 0) {
    throw new Error("Must pass directory as first argument");
  }

  if (arguments.length === 2 && opts.basenames) {
    // if options with basenames key is passed, explicitly include those files
    opts.basenames.forEach(function (basename) {
      var filepath = Path.resolve(Path.join(dir, basename));

      if (opts.convertKeysToCamelCase) {
        basename = camelCase(basename);
      }

      requires[basename] = require(filepath);
    });

  } else {
    // if basenames arguments isn't passed, require all javascript
    // files (except for those prefixed with _) and all directories

    var files = FS.readdirSync(dir);

    // sort files in lowercase alpha for linux
    files.sort(function (a,b) {
      a = a.toLowerCase();
      b = b.toLowerCase();

      if (a < b) {
        return -1;
      } else if (b < a) {
        return 1;
      } else {
        return 0;
      }
    });

    files.forEach(function (filename) {
      // ignore index.js and files prefixed with underscore and
      if ((filename === 'index.js') || (filename[0] === '_') || (filename[0] === '.')) {
        return;
      }

      var filepath = Path.resolve(Path.join(dir, filename));
      var ext      = Path.extname(filename);
      var stats    = FS.statSync(filepath);

      // don't require non-javascript files (.txt .md etc.)
      if (stats.isFile() && !(ext in require.extensions)) {
        return;
      }

      var basename = Path.basename(filename, ext);

      if (opts.convertKeysToCamelCase) {
        basename = camelCase(basename);
      }

      requires[basename] = require(filepath);
    });

  }

  return requires;
};
