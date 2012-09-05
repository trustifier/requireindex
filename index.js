var fs   = require('fs');
var path = require('path');

module.exports = function (dir, basenames) {
  var requires = {};
  
  if (arguments.length === 1) {
    // if basenames arguments isn't passed, require all javascript
    // files (except for those prefixed with _) and all directories
    
    var files = fs.readdirSync(dir);
    
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
      // ignore index.js and files prefixed with underscore
      if ((filename === 'index.js') || (filename[0] === '_')) { return; }
      
      var filepath = path.resolve(path.join(dir, filename));
      var ext = path.extname(filename);
      var stats = fs.statSync(filepath);
      
      // don't require non-javascript files (.txt .md etc.)
      if (stats.isFile() && !(ext in require.extensions)) { return; }
      
      var basename = path.basename(filename, ext);
      
      requires[basename] = require(filepath);
    });
  
  } else {
    // if basenames argument is passed, explicitly include those files
    basenames.forEach(function (basename) {
      var filepath = path.resolve(path.join(dir, basename));
      requires[basename] = require(filepath);
    });
  }
  
  return requires;
};
