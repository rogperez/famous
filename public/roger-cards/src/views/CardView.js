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
    var position = new Transitionable([0, 0]);
    var opacity = new Transitionable(1);

    var sync = new GenericSync({
      "mouse"  : {},
      "touch"  : {},
      "scroll" : {scale : .5}
    });

    var card = new ImageSurface({
      size: [this.options.screenWidth, true],
      content: this.options.photoUrl,
      properties: {
        borderRadius: '5px'
      }
    });

    var positionModifier = new Modifier({
      transform : function(){
        var currentPosition = position.get();
        return Transform.translate(currentPosition[0], currentPosition[1], 0);
      },
      opacity: function() {
        return opacity.get();
      }
    });

    card.pipe(sync);

    var opacityDifference = 0;
    sync.on('update', function(data){
      var currentPosition = position.get();
      var currentOpacity = opacity.get();
      position.set([
        currentPosition[0] + data.delta[0],
        0
      ]);
      
      if(data.delta[0] > 0)
        opacity.set(currentOpacity - (data.delta[0]/1000));
      else 
        opacity.set(currentOpacity - (-data.delta[0]/1000));
    });

    sync.on('end', function(data) {
      var velocity = data.velocity;
      position.set([0, 0], {
        method : 'spring',
        dampingRatio: 0.8
      });
      opacity.set(1, {
        velocity : velocity
      });
    });

    this.add(positionModifier).add(card);
  }

  module.exports = CardView;
});