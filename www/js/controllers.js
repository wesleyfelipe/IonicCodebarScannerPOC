angular.module('starter.controllers', [])

    .controller('AtendimentoController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, $cordovaSQLite) {
        var vm = this;
        $scope.codigosLidos = [];

        $scope.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        $scope.addResultado(result);
                    }, function(error) {
                        alert("Erro ao ler QRCode.");
                    });
            });
        };

        $scope.addResultado = function(result){
            if(result !== {}){
                alert(JSON.stringify(result));
                $scope.insert(result.text, result.format, result.cancelled);
                $scope.selectAll();
                //vm.scan();
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
    })

    .controller('MenuController', function($scope) {
    })

    .controller('HomeController', function($scope, $stateParams) {
    })
