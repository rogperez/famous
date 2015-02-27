define(function(require, exports, module) {
  var Engine    = require('famous/core/Engine');
  var AppView   = require('views/AppView');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Transform = require('famous/core/Transform');
  var mainContext = Engine.createContext();

  function initApp() {
    var appView = new AppView();

    var background = new ImageSurface({
      content: 'img/background.png',
    });

    var backgroundModifier = new StateModifier({
      transform: Transform.translate(0, 0, 0)
    });

    mainContext.add(backgroundModifier).add(background);
    mainContext.add(appView);
  }
  
  initApp();
});