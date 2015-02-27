define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var DeckView = require('views/DeckView');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function AppView() {
    View.apply(this, arguments);

    var deckView = new DeckView({
      cardData: [0,1,2]
    });

    this.add(deckView);
  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    padding: 10
  };

  module.exports = AppView;
});