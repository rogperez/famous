define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var DeckView = require('views/DeckView');
  var ImageData = require('data/ImageData');

  function AppView() {
    View.apply(this, arguments);

    var deck = new DeckView({imageData: ImageData});
    this.add(deck);
  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {};

  module.exports = AppView;
});