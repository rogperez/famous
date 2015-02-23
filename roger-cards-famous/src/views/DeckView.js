define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var CardView = require('views/CardView');
  var Transitionable = require('famous/transitions/Transitionable');
  var Modifier = require('famous/core/Modifier');
  var SpringTransition = require('famous/transitions/SpringTransition');
  var GenericSync = require('famous/inputs/GenericSync');
  var MouseSync = require('famous/inputs/MouseSync');
  var TouchSync = require('famous/inputs/TouchSync');

  GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});  
  Transitionable.registerMethod('spring', SpringTransition);

  function DeckView() {
    View.apply(this, arguments);
    
    this.cardViewPos = new Transitionable(0);

    _createCards.call(this);
  };

  DeckView.prototype = Object.create(View.prototype);
  DeckView.prototype.constructor = DeckView;
  DeckView.prototype.showCurrentCard = function() {
    var card = this.cards[this.currentIndex]; // CardView
    var cardModifier = this.cardModifiers[this.currentIndex];
    
    this.add(cardModifier).add(card);
  };
  DeckView.prototype.showNextCard = function() {
    var cardModifier = this.cardModifiers[this.currentIndex];
    var card = this.cards[this.currentIndex];

    cardModifier.setTransform(
      Transform.translate(-400, 0, 0, -0.1),  
      { duration: 400 },
      function() {
        //restrict the cards from moving down past entire length of the deck
        if(this.options.currentY === this.cardModifiers.length * 10) {
          this.options.currentY = 30;
        } else {
          this.options.currentY += 10;
        }
        
        this.options.currentZ--;        
        cardModifier.setTransform(Transform.translate(100, this.options.currentY, this.options.currentZ, -0.1));
        this.moveDeckIntoStartingYPos();
      }.bind(this)
    );
    
    this.currentIndex++;
    if(this.currentIndex === this.options.imageData.length) {
      this.currentIndex = 0;
    }
    
    this.showCurrentCard();
  };
  DeckView.prototype.moveDeckIntoStartingYPos = function (y) {
    for(var i = 0; i < this.cardModifiers.length; i++) {
      var transform = this.cardModifiers[i].getTransform();
      var y = transform[13];
      var z = transform[14];
      
      this.cardModifiers[i].setTransform(Transform.translate(100, y - 10, z, -0.1), {duration: 200});
    }
  }
  DeckView.prototype.setCardPos = function(d) {
  }


  DeckView.DEFAULT_OPTIONS = {
    cardSize: [400, 187.5],
    imageData: undefined, // pass in as 'arguments'
    currentZ: 0, // set in _createCards
    currentY: 0, // set in _createCards
    maxY: 0
  };

  function _createCards() {
    this.cards = [];
    this.cardModifiers = [];
    this.currentIndex = 0;

    for(var i = 0; i < this.options.imageData.length; i++) {
      this.options.currentY = 10*i;
      var card = new CardView({
        size: this.options.cardSize,
        photoUrl: this.options.imageData[i].url,
        zIndex: -i
      });

      var cardModifier = new StateModifier({
        transform: Transform.translate(100, this.options.currentY, 0, 0.1)
      })
      
      this.options.currentZ = -i;
      this.cards.push(card);
      this.cardModifiers.push(cardModifier);
      this.add(cardModifier).add(card);

      card.on('click', this.showNextCard.bind(this));
    }

    
  }
  
  function _handleSwipe() {
    var sync = new GenericSync(
      ['mouse', 'touch'],
      {direction: GenericSync.DIRECTION_X}
    );
    
    this.pageView.pipe(sync);

    sync.on('update', function(data) {
      var currentPosition = this.pageViewPos.get();
      var currentPosition = this.pageViewPos.get();
      if(currentPosition === 0 && data.velocity > 0) {
          this.menuView.animateStrips();
      }

      this.pageViewPos.set(Math.max(0, currentPosition + data.delta));

    }.bind(this));

    sync.on('end', (function(data){
      var velocity = data.velocity;
      var position = this.pageViewPos.get();

      if(position > this.options.posThreshold) {
          if(velocity < - this.options.velThreshold) {
              this.slideLeft();
          } else {
              this.slideRight();
          }
      } else {
          if(velocity > this.options.velThreshold) {
              this.slideRight();
          } else {
              this.slideLeft();
          }
      }
    }).bind(this));
  }

  module.exports = DeckView;
});