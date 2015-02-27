define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface  = require('famous/surfaces/ImageSurface');
  var Draggable     = require('famous/modifiers/Draggable');
  var Modifier      = require("famous/core/Modifier");
  var MouseSync     = require("famous/inputs/MouseSync");
  var TouchSync     = require("famous/inputs/TouchSync");
  var ScrollSync    = require("famous/inputs/ScrollSync");
  var GenericSync   = require("famous/inputs/GenericSync");
  var Transitionable = require("famous/transitions/Transitionable");
  var SnapTransition = require("famous/transitions/SnapTransition");
  Transitionable.registerMethod("spring", SnapTransition);

  GenericSync.register({
    'mouse' : MouseSync,
    'touch' : TouchSync,
    'scroll': ScrollSync
  });

  function CardView() {
    View.apply(this, arguments);
    

    _createCardSurface.call(this);
  };

  CardView.prototype = Object.create(View.prototype);
  CardView.prototype.constructor = CardView;

  CardView.DEFAULT_OPTIONS = {
    width: undefined,
    photoUrl: 'img/card.png'
  };

  function _createCardSurface() {
    var card = new ImageSurface({
      size: [undefined, true],
      content: this.options.photoUrl,
      properties: {
        borderRadius: '5px'
      }
    });

    card.pipe(this._eventOutput);

    this.add(card);
  }

  module.exports = CardView;
});