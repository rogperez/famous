define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function DeckView() {
    View.apply(this, arguments);

    var deckModifier = new StateModifier({
      align: [0, 0.6]
    });

    this.rootNode = this.add(deckModifier);

    _createCards.call(this);
  };

  /*=========================================================
  * METHODS
  =========================================================*/
  DeckView.prototype = Object.create(View.prototype);
  DeckView.prototype.constructor = DeckView;

  // move card in first position to last position
  DeckView.prototype.translate = function() {
    var card = this.cards[0];
    var runnerUp = this.cards[1];
    var finalIndex = this.cards.length;

    sync.unsubscribe(card);
    sync.subscribe(runnerUp);
  };

  /*=========================================================
  *       OPTIONS
  =========================================================*/
  DeckView.DEFAULT_OPTIONS = {
    screenWidth: undefined,
    card0XOffset: undefined,
    card1XOffset: undefined,
    card2XOffset: undefined,
    card0RelativeWidth: 0.9375,
    card1RelativeWidth: 0.84375,
    card2RelativeWidth: 0.75,
    yOffset: 20;
  };

  //set offsets
  DeckView.DEFAULT_OPTIONS.card0XOffset = (1 - this.options.card0RelativeWidth)/2;
  DeckView.DEFAULT_OPTIONS.card1XOffset = (1 - this.options.card1RelativeWidth)/2;
  DeckView.DEFAULT_OPTIONS.card2XOffset = (1 - this.options.card2RelativeWidth)/2;

  //set sizes
  DeckView.DEFAULT_OPTIONS.card0Width = DeckView.DEFAULT_OPTIONS.screenWidth * card0RelativeWidth;
  DeckView.DEFAULT_OPTIONS.card1Width = DeckView.DEFAULT_OPTIONS.screenWidth * card1RelativeWidth;
  DeckView.DEFAULT_OPTIONS.card2Width = DeckView.DEFAULT_OPTIONS.screenWidth * card2RelativeWidth;

  /*=========================================================
  *             FUNCTIONS
  =========================================================*/
  function _createCards() {
    this.cardModifiers = [];

    var o = this.options;
    var cardData = o.cardData;
    var yOffset = o.yOffset * 3;
    var zOffset = 30;
    for(var i = 0; i < cardData.length; i++) {
      switch(i) {
        case 0:
          var Modifier = new Modifier({
            size: [o.card0Width, true],
            transition: function() {
              return Transition.translate(o.card0XOffset, yOffset, zOffset);
            }
          });
          break;
        case 1:
          var Modifier = new Modifier({
            transition: function() {
              return Transition.translate(o.card1XOffset, yOffset, zOffset);
            }
          });
          break;
        case 2:
          var Modifier = new Modifier({
            size: [o.card2Width, true],
            transition: function() {
              return Transition.translate(o.card2XOffset, yOffset, zOffset);
            }
          });
          break;
        default:
          var Modifier = new Modifier({
            size: [o.card2Width, true],
            transition: function() {
              return Transition.translate(o.card2XOffset, yOffset, zOffset);
            }
          });
      }
      
      zOffset -= 10;
      yOffset -= this.options.yOffset;

      var Card = new CardView();
      this.rootNode.add(Modifier).add(Card);
      this.cardModifiers.push(Modifier);
      if(i === cardData.length - 1) sync.subscribe(Card);
    }
  }

  module.exports = DeckView;
});