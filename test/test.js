var Assert = require('assert');
var Asserts = require('asserts');

Asserts(function () {
  var lib = require('./lib');

  return {
    "requireindex should": {
      "properly include files parallel to index.js and maintain structure": function () {
        Asserts.all.equal([
          [lib.Bam.m,            [], "ok"],
          [lib.Bar.f,            [], "yea"],
          [lib.Bar.fing,         [], 'definitely'],
          [lib.Bar.foo_bla,       [], 'camel case my file name'],
          [lib.Foo.l,            [], 'yes'],
          [lib.Foo.ls,           [], 'yep'],
          [lib.Bam.n,            [], 'ack'],
          [lib.Bar.fed.again,    [], 'again'],
          [lib.Bar.fed.somemore, [], 'somemore']
        ]);
      },

      "ignore _ prefixed files": function () {
        Assert.equal(('_private' in lib), false);
      },

      "not include files not mentioned when second array argument is used": function () {
        Assert.equal(('ignored' in lib.Bar.fed), false);
      },

      "ignore non javascript files": function () {
        Assert.equal(('not_javascript' in lib), false);
      },

      "sort files by lowercase alpha of the filename": function () {
        Assert.equal(Object.keys(lib)[0], 'Bam');
      },

      "ignore dot files": function () {
        Assert.equal(('.also_private' in lib), false);
      },
    }
  };
});
