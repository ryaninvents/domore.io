// Generated by CoffeeScript 1.6.2
(function() {
  module.exports = function(entry) {
    var data, re, tag;

    tag = entry.match(/\w+/);
    tag = tag[0];
    entry = '{' + entry.substr(tag.length).trim() + '}';
    re = /\:\s*(?![."\s\d])([^{}[\]",]+)\s*(?=[,}]|$)/g;
    entry = entry.replace(/([{,]\s*)(\w+)\:/g, function(whole, $1, $2) {
      return $1 + '"' + $2 + '":';
    });
    data = JSON.parse(entry);
    return [tag, data];
  };

}).call(this);
