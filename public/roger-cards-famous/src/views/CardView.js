define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Draggable = require('famous/modifiers/Draggable');

  function CardView() {
    View.apply(this, arguments);
    
    _createCardSurface.call(this);
  };

  CardView.prototype = Object.create(View.prototype);
  CardView.prototype.constructor = CardView;

  CardView.DEFAULT_OPTIONS = {
    cardSize: [400, 187.5],
    photoUrl: 'img/card_1.png',
    zIndex: '100'
  };

  function _createCardSurface() {
    this.draggable = new Draggable({
      xRange: [-10000, 1000],
      yRange: [-100, 100]
    });

    this.card = new ImageSurface({
      size: this.options.cardSize,
      content: this.options.photoUrl,
      properties: {
        border: '2px solid black',
        borderRadius: '5px'
      }
    });

    this.add(this.draggable).add(this.card);
    this.card.pipe(this.draggable);
    this.card.on('click', function() {
      this._eventOutput.emit('click');
    }.bind(this));
  }

  module.exports = CardView;
});