// Generated by CoffeeScript 1.6.2
(function() {
  var Snippet, db, handleJson;

  db = require('./db');

  handleJson = require('../handlers/json');

  /**
    @class Snippet
  */


  Snippet = (function() {
    /**
      @field _id {ObjectID}
      @field owner {ObjectID}
      @field originalEntry {string}
      @field ts {Date} timestamp
      @field data {Object}
      @field location {pos:{lat:number, lon:number, sigma:number}, alt:{value:number, sigma:number}}
      @field hashtags {Array(string)}
      @field handler {string}
    */
    function Snippet(config) {
      this._id = config._id, this.owner = config.owner, this.originalEntry = config.originalEntry, this.ts = config.ts, this.location = config.location, this.data = config.data, this.hashtags = config.hashtags, this.handler = config.handler;
    }

    /**
      @method pickle
    */


    Snippet.prototype.pickle = function() {
      var snipData;

      snipData = {
        owner: this.owner,
        originalEntry: this.originalEntry,
        ts: this.ts,
        location: this.location,
        data: this.data,
        hashtags: this.hashtags,
        handler: this.handler
      };
      if (this._id) {
        snipData._id = this._id;
      }
      return snipData;
    };

    /**
      @method save
    */


    Snippet.prototype.save = function(callback) {
      var snipData,
        _this = this;

      snipData = this.pickle();
      return db.collection('snippets', function(err, cxn) {
        return cxn.save(snipData, {
          safe: true
        }, function(err, result) {
          _this.id = result._id;
          return callback(err);
        });
      });
    };

    Snippet.prototype.handle = function(callback) {
      var entry, err, handled, q, tag;

      entry = this.originalEntry;
      handled = false;
      if (entry.match(/^\/\//)) {
        this.data = entry.substr(2).trim();
        this.handler = 'note';
        handled = true;
      } else {
        try {
          q = handleJson(entry);
          tag = q[0], this.data = q[1], this.hashtags = q[2];
          this.handler = tag;
          handled = true;
        } catch (_error) {
          err = _error;
          console.log(err);
          this.data = this.originalEntry;
          this.handler = 'data';
        }
      }
      return callback(null, handled);
    };

    Snippet.prototype.handleAndSave = function(callback) {
      var _this = this;

      return this.handle(function(err) {
        return _this.save(callback);
      });
    };

    return Snippet;

  })();

  Snippet.getAllForUser = function(user, callback) {
    return Snippet.getAllPicklesForUser(user, function(err, docs) {
      var doc, snippets;

      if (err) {
        callback(err);
      }
      snippets = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          doc = docs[_i];
          _results.push(new Snippet(doc));
        }
        return _results;
      })();
      return callback(null, snippets);
    });
  };

  Snippet.getAllPicklesForUser = function(user, callback) {
    return db.collection('snippets', function(err, cxn) {
      return cxn.find({
        owner: user._id
      }).sort({
        ts: 1
      }).toArray(function(err, docs) {
        var snippets;

        if (err) {
          callback(err);
        }
        snippets = docs;
        return callback(null, snippets);
      });
    });
  };

  module.exports = Snippet;

}).call(this);
