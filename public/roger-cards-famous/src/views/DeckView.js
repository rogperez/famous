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
  var ScrollSync = require('famous/inputs/TouchSync');

  GenericSync.register({'mouse': MouseSync, 'touch': TouchSync, 'scroll': ScrollSync});  
  Transitionable.registerMethod('spring', SpringTransition);
  var transition = {
    method: 'spring',
    period: 375,
    dampingRatio: .65,
    velocity: 0
  };

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
  DeckView.prototype.showNextCard = function(direction) {
    var cardModifier = this.cardModifiers[this.currentIndex];
    var card = this.cards[this.currentIndex];
    var transformX;
    
    if(direction > 0) {
      transformX = 400;
    } else {
      transformX = -400;
    }
    cardModifier.setTransform(
      Transform.translate(transformX, 0, 0, -0.1),  
      { duration: 400 },
      function() {
        //restrict the cards from moving down past entire length of the deck
        if(this.options.currentY === this.cardModifiers.length * this.options.yOffset) {
          this.options.currentY = this.cardModifiers.length * this.options.yOffset;
        } else {
          this.options.currentY += this.options.yOffset;
        }
        
        this.options.currentZ -= 10;
        card.draggable.setPosition([0, 0, 0]);
        cardModifier.setTransform(
          Transform.translate(this.options.defaultXPos, this.options.currentY, this.options.currentZ, -0.1)
        );
        this.moveDeckIntoStartingYPos();
      }.bind(this)
    );
    
    this.currentIndex++;
    if(this.currentIndex === this.options.imageData.length) {
      this.currentIndex = 0;
    }
    
    this.showCurrentCard();
  };
  DeckView.prototype.flipCardLeft = function() {
  }
  DeckView.prototype.flipCardRight = function() {
  }
  DeckView.prototype.moveDeckIntoStartingYPos = function (y) {
    for(var i = 0; i < this.cardModifiers.length; i++) {
      var transform = this.cardModifiers[i].getTransform();
      var y = transform[13];
      var z = transform[14];
      
      this.cardModifiers[i].setTransform(
        Transform.translate(this.options.defaultXPos, y - this.options.yOffset, z, -0.1),
        {duration: 200}
      );
    }
  }
  DeckView.prototype.setCardPos = function(d) {
  }
  DeckView.prototype.resetCardView = function() {
    var cardModifier = this.cardModifiers[this.currentIndex];
    var card = this.cards[this.currentIndex];
    var transform = cardModifier.getTransform();
    var y = transform[13];
    var z = transform[14];
    
    card.draggable.setPosition([0, 0, z], transition);
    cardModifier.setTransform(
      Transform.translate(this.options.defaultXPos, y, z, -0.1),
      transition
    )
  }

  DeckView.DEFAULT_OPTIONS = {
    cardSize: [400, 187.5],
    imageData: undefined, // pass in as 'arguments'
    currentZ: 99999, // set in _createCards
    currentY: 0, // set in _createCards
    yOffset: 40,
    defaultXPos: 10  
  };

  function _createCards() {
    this.cards = [];
    this.cardModifiers = [];
    this.currentIndex = 0;

    for(var i = 0; i < this.options.imageData.length; i++) {
      var currentZ = this.options.currentZ - 10;
      this.options.currentY = this.options.yOffset*i;
      var card = new CardView({
        size: this.options.cardSize,
        photoUrl: this.options.imageData[i].url
      });
      
      var cardModifier = new StateModifier({
        transform: Transform.translate(10, this.options.currentY, currentZ, 0.1)
      })
      
      this.options.currentZ = currentZ;
      this.cards.push(card);
      this.cardModifiers.push(cardModifier);
      this.add(cardModifier).add(card);
      
      card.draggable.on('update', onDragMove.bind(this));
      card.draggable.on('end', _onDragEnd.bind(this));
    }
  }
  
  function onDragMove(e) {
    var cardModifier = this.cardModifiers[this.currentIndex];
    var card = this.cards[this.currentIndex];
    
    cardModifier.setTransform(
      Transform.rotateZ(e.position[0] * 0.0005)
    );
    
  }
  
  function _onDragEnd(e) {
    if(e.position[0] < -160 || e.position[0] > 160) {
      this.showNextCard(e.position[0]);
    } else {
      this.resetCardView();
    }
  }

  module.exports = DeckView;
});