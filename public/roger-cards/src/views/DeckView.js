define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Transitionable = require('famous/transitions/Transitionable');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Modifier      = require('famous/core/Modifier');
  var CardView      = require('views/CardView');
  var MouseSync     = require("famous/inputs/MouseSync");
  var TouchSync     = require("famous/inputs/TouchSync");
  var ScrollSync    = require("famous/inputs/ScrollSync");
  var GenericSync   = require("famous/inputs/GenericSync");
  var SnapTransition = require("famous/transitions/SnapTransition");
  Transitionable.registerMethod("spring", SnapTransition);

  GenericSync.register({
    "mouse"  : MouseSync,
    "touch"  : TouchSync,
    "scroll" : ScrollSync
  });

  function DeckView() {
    View.apply(this, arguments);

    var deckModifier = new StateModifier({
      align: [0, 0.5]
    });

    this.rootNode = this.add(deckModifier);

    _handleListeners.call(this);
    _createCards.call(this);

  };

  /*=========================================================
  * METHODS
  =========================================================*/
  DeckView.prototype = Object.create(View.prototype);
  DeckView.prototype.constructor = DeckView;

  // move card in first position to last position
  DeckView.prototype.translateHandlers = function() {
    var cards = this.cards;
    if(cards.length >= 2) {
      var card = this.cards[0].card;
      var runnerUp = this.cards[1].card;

      card.unpipe(this.xSync);
      runnerUp.pipe(this.xSync);
      }
  };

  DeckView.prototype.translateCards = function () {
    var cards = this.cards;
    if(cards.length > 2) {
      for(var i = 0; i < cards.length; i++) {

      }
    }
  }


  /*=========================================================
  *       OPTIONS
  =========================================================*/
  DeckView.DEFAULT_OPTIONS = {
    cardData: undefined,
    screenWidth: window.screen.availWidth,
    card0XOffset: undefined,
    card1XOffset: undefined,
    card2XOffset: undefined,
    card0Width: undefined,
    card1Width: undefined,
    card2Width: undefined,
    card0RelativeWidth: 0.9375,
    card1RelativeWidth: 0.84375,
    card2RelativeWidth: 0.75,
    yOffset: 9
  };

  //set offsets relative to screenWidth
  DeckView.DEFAULT_OPTIONS.card0XOffset = ((1 - DeckView.DEFAULT_OPTIONS.card0RelativeWidth)/2) * DeckView.DEFAULT_OPTIONS.screenWidth;
  DeckView.DEFAULT_OPTIONS.card1XOffset = ((1 - DeckView.DEFAULT_OPTIONS.card1RelativeWidth)/2) * DeckView.DEFAULT_OPTIONS.screenWidth;
  DeckView.DEFAULT_OPTIONS.card2XOffset = ((1 - DeckView.DEFAULT_OPTIONS.card2RelativeWidth)/2) * DeckView.DEFAULT_OPTIONS.screenWidth;

  //set sizes relative to screenWidth
  DeckView.DEFAULT_OPTIONS.card0Width = DeckView.DEFAULT_OPTIONS.screenWidth * DeckView.DEFAULT_OPTIONS.card0RelativeWidth;
  DeckView.DEFAULT_OPTIONS.card1Width = DeckView.DEFAULT_OPTIONS.screenWidth * DeckView.DEFAULT_OPTIONS.card1RelativeWidth;
  DeckView.DEFAULT_OPTIONS.card2Width = DeckView.DEFAULT_OPTIONS.screenWidth * DeckView.DEFAULT_OPTIONS.card2RelativeWidth;

  /*=========================================================
  *             FUNCTIONS
  =========================================================*/
  function _createCards() {
    this.cards = [];

    var o = this.options;
    var cardData = o.cardData;
    for(var i = 0; i < cardData.length; i++) {
      // var Card = new CardView();
      // var sizeTrans = new Transitionable(o['card' + i + 'Width']);
      // var xTrans = new Transitionable(o['card' + i + 'Width']);
      // var oTrans = new Transitionable(1);


      switch (i) {
        case 0:
          var Card = new CardView();
          var sizeTrans = new Transitionable(o.card0Width);
          // todo: change this to a TransitionableTransform.
          var xTrans = new Transitionable(o.card0XOffset);
          var yTrans = new Transitionable(o.yOffset*3);
          var zTrans = new Transitionable(30);
          var CardModifier = new Modifier({
            size: [sizeTrans.get(), true],
            transform: function() {
              return Transform.translate(xTrans.get(), yTrans.get(), zTrans.get());
            },
            opacity: function() {
              return oTrans.get();
            }
          });

          Card.pipe(this.xSync);

          break;
        case 1:
          var Card = new CardView();
          var sizeTrans = new Transitionable(o.card1Width);
          var xTrans = new Transitionable(o.card1XOffset);
          var yTrans = new Transitionable(o.yOffset*2);
          var zTrans = new Transitionable(20);
          var oTrans = new Transitionable(1);
          var CardModifier = new Modifier({
            size: [sizeTrans.get(), undefined],
            transform: function() {
              return Transform.translate(xTrans.get(), yTrans.get(), zTrans.get());
            },
            opacity: function() {
              return oTrans.get();
            }
          });
          break;
        case 2:
          var Card = new CardView();
          var sizeTrans = new Transitionable(o.card2Width);
          var xTrans = new Transitionable(o.card2XOffset);
          var yTrans = new Transitionable(o.yOffset*2);
          var zTrans = new Transitionable(10);
          var oTrans = new Transitionable(1);
          var CardModifier = new Modifier({
            size: [sizeTrans.get(), undefined],
            transform: function() {
              return Transform.translate(xTrans.get(), yTrans.get(), zTrans.get());
            },
            opacity: function() {
              return oTrans.get();
            }
          });
          break;
        default:
          var Card = new CardView();
          var sizeTrans = new Transitionable(o.card2Width);
          var xTrans = new Transitionable(o.card2XOffset);
          var yTrans = new Transitionable(o.yOffset*2);
          var zTrans = new Transitionable(10);
          var oTrans = new Transitionable(1);
          var CardModifier = new Modifier({
            size: [sizeTrans.get(), undefined],
            transform: function() {
              return Transform.translate(xTrans.get(), yTrans.get(), zTrans.get());
            },
            opacity: function() {
              return oTrans.get();
            }
          });
      }

      this.rootNode.add(CardModifier).add(Card);
      this.cards.push({
        card: Card,
        modifier: CardModifier,
        transitionables: {
          x: xTrans,
          y: yTrans,
          z: zTrans,
          o: oTrans,
          size: sizeTrans
        }
      });
    }
  }

  function _handleListeners() {
    this.xSync = new GenericSync(
      ['mouse', 'touch', 'scroll'],
      {direction : GenericSync.DIRECTION_X}
    );

    this.xSync.on('update', function(data) {
      var currentCard = this.cards[0];
      var transitionables = currentCard.transitionables;
      var xPos = transitionables.x;
      var opacity = transitionables.o;

      xPos.set(xPos.get() + data.delta);


      if(data.delta > 0)
      {
        opacity.set(opacity.get() - (data.position/100000));
      }
      else
      {
        opacity.set(opacity.get() - (-data.position/100000));
      }

    }.bind(this));

    this.xSync.on('end', function(data) {
      var currentCard = this.cards[0];
      var transitionables = currentCard.transitionables;
      var xPos = transitionables.x;
      var opacity = transitionables.o;
      var o = this.options;

      var velocity = data.velocity;
      if(velocity > 1.5 || velocity < -1.5) {


      } else {
        xPos.set(o.card0XOffset, {
          method : 'spring',
          dampingRatio: 0.95,
          velocity: data.velocity
        });
        opacity.set(1);
      }
    }.bind(this));
  }
  module.exports = DeckView;
});