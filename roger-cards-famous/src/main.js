define(function(require, exports, module) {
  var Engine    = require('famous/core/Engine');
  var AppView   = require('views/AppView');
  var mainContext = Engine.createContext();

  function initApp() {
    var appView = new AppView();

    mainContext.add(appView);
  }
  
  initApp();
});