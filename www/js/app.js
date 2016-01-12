// Ionic Starter App

//Variavel para armazenar a conexão com o banco
//var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ionic.service.core',
  'ngCordova',
  'ionic.service.push',
  'ionic.service.deploy',
  'starter.controllers'
])

.run(function($rootScope, $ionicDeploy, $ionicPlatform, $cordovaStatusbar, $cordovaSQLite) {

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    // Color the iOS status bar text to white
    //if (window.StatusBar) {
    //  $cordovaStatusbar.overlaysWebView(true);
    //  $cordovaStatusbar.style(1); //Light
    //}
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // Default update checking
    $rootScope.updateOptions = {
      interval: 2 * 60 * 1000
    };

    //Teste SqLite
    db = $cordovaSQLite.openDB({name: "my.db"});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS codigos_lidos (id integer primary key, texto text, formato text, cancelado text)");


    // Watch Ionic Deploy service for new code
    $ionicDeploy.watch($rootScope.updateOptions).then(function() {}, function() {}, function(hasUpdate) {
      $rootScope.lastChecked = new Date();
      console.log('WATCH RESULT', hasUpdate);
    });
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuController'
    })

    .state('menu.atendimento', {
      url: "/atendimento",
      views: {
        'menuContent' :{
          templateUrl: "templates/atendimento.html",
          controller: 'AtendimentoController'
        }
      }
    })

    .state('menu.sincronizar', {
      url: "/sincronizar",
      views: {
        'menuContent' :{
          templateUrl: "templates/sincronizar.html"
        }
      }
    })

    .state('menu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeController'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/menu/home');
});
