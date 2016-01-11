angular.module('scanner.controllers', [])
    .controller('HomeController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, $cordovaSQLite) {
        var vm = this;
        $scope.codigosLidos = [];
        var db = $cordovaSQLite.openDB({name: "my.db"});

        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        vm.scanResults.texto = result.text;
                        vm.scanResults.formato = result.format;
                        vm.scanResults.cancelado = result.cancelled;
                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                    });
            });
        };

        $scope.addResultado = function(){
            if(vm.scanResults !== {}){
                $scope.insert(vm.scanResults.texto, vm.scanResults.formato, vm.scanResults.cancelado);
                $scope.selectAll();
            }
        }

        $scope.insert = function(texto, formato, cancelado) {
            var query = "INSERT INTO codigos_lidos (texto, formato, cancelado) VALUES (?,?,?)";
            $cordovaSQLite.execute(db, query, [texto, formato, cancelado]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                alert(err);
            });
        }

        $scope.selectAll = function() {
            $scope.codigosLidos = [];
            console.log(">>>>>>>>>>>>>>>>>>>>> TESTE");
            var query = "SELECT * FROM codigos_lidos";
            $cordovaSQLite.execute(db, query).then(function(res) {
                if(res.rows.length > 0) {
                    for(var i = 0; i < res.rows.length; i++) {
                        $scope.codigosLidos.push(res.rows.item(i));
                    }
                } else {
                    console.log("No results found");
                }
            }, function (err) {
                console.error(err);
            });
        }

        $scope.selectAll();
        vm.scanResults = {};
    });
