// Generated by CoffeeScript 1.6.2
(function() {
  var Snippet, ajaxUI, jade;

  Snippet = require('../core/snippet');

  jade = require('jade');

  ajaxUI = {
    makePanel: function(data, callback) {
      return jade.renderFile('views/partials/panel.jade', data, callback);
    }
  };

  module.exports = function(app) {
    app.post('/ajax/snippets/new', function(req, res) {
      var snippet;

      if (!req.user) {
        res.json({
          error: 'not logged in'
        });
        return;
      }
      snippet = new Snippet({
        originalEntry: req.body.entry,
        owner: req.user._id,
        ts: new Date,
        location: req.body.location
      });
      return snippet.handleAndSave(function(err) {
        var _ref, _ref1;

        if (err) {
          res.json({
            error: err
          });
        }
        return res.json({
          ok: true,
          id: snippet._id,
          entry: snippet.originalEntry,
          data: (_ref = snippet.data) != null ? _ref : snippet.originalEntry,
          handler: snippet.handler,
          panel: ajaxUI.makePanel({
            content: (_ref1 = snippet.data) != null ? _ref1 : snippet.originalEntry,
            handler: snippet.handler,
            ts: snippet.ts
          })
        });
      });
    });
    return app.get('/ajax/snippets/get', function(req, res) {
      if (!req.user) {
        res.json({
          error: 'not logged in'
        });
      }
      return Snippet.getAllForUser(req.user, function(err, data) {
        var snippet;

        if (err) {
          res.json({
            err: err
          });
        }
        return res.json({
          ok: true,
          panels: (function() {
            var _i, _len, _ref, _results;

            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              snippet = data[_i];
              _results.push(ajaxUI.makePanel({
                content: (_ref = snippet.data) != null ? _ref : snippet.originalEntry,
                handler: snippet.handler,
                ts: snippet.ts
              }));
            }
            return _results;
          })()
        });
      });
    });
  };

}).call(this);