define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var CardView = require('views/CardView');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function AppView() {
    View.apply(this, arguments);

    var deckModifier = new StateModifier({
      align: [0, 0.6],
      transform: Transform.translate(10, 0, 10)
    });

    var cardView = new CardView({
      screenWidth: window.screen.availWidth - this.options.padding * 2
    });

    this.add(deckModifier).add(cardView);
  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    padding: 10
  };

  module.exports = AppView;
});