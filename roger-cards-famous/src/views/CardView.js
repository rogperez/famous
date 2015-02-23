define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function CardView() {
    View.apply(this, arguments);

    _createCardSurface.call(this);
  };

  CardView.prototype = Object.create(View.prototype);
  CardView.prototype.constructor = CardView;
  CardView.prototype.moveToDeckPos = function(z) {  
    this.card.setTransform(
      Transform.translate(100,0,z,-0.1)
    );
  }

  CardView.DEFAULT_OPTIONS = {
    cardSize: [400, 187.5],
    photoUrl: 'img/card_1.png',
    zIndex: '0'
  };

  function _createCardSurface() {

    this.card = new ImageSurface({
      size: this.options.cardSize,
      content: this.options.photoUrl,
      properties: {
        border: '2px solid black',
        borderRadius: '5px',
        zIndex: this.options.zIndex
      }
    });

    this.add(this.card);
    this.card.on('click', function() {
      this._eventOutput.emit('click');
    }.bind(this));
  }

  module.exports = CardView;
});