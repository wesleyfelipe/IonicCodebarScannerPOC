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

    .controller('SyncController', function($scope, $cordovaSQLite, $q) {

        $scope.poc = {
            qtd : 0,
            initial : 0,
            final: 0,
            total: 0
        }

        $scope.insert = function(tx, texto, formato, cancelado) {
            var query = "INSERT INTO codigos_lidos (texto, formato, cancelado) VALUES (?,?,?)";
            return tx.executeSql(query, [texto, formato, cancelado]);
        }

        var insertAllTransaction = function(){
            var deferred = $q.defer();
            db.transaction(function(tx) {
                var i = 0;
                while(i < $scope.poc.qtd){
                    $scope.insert(tx, 'teste', 'teste', 'teste');
                    i++;
                }
              }, function(error) {
                console.log('Transaction ERROR: ' + error.message);
                deferred.reject();
              }, function() {
                console.log('Populated database OK');
                deferred.resolve(true);
              });
            return deferred.promise;
        }

         var logaRegistros = function(){
            var query = "SELECT * FROM codigos_lidos";
            $cordovaSQLite.execute(db, query).then(function(res) {
                console.log("Quantidade de registros no banco: " + res.rows.length);
            }, function (err) {
                console.error(err);
            });
        }

        var limparBanco = function(){
            var sql = "DELETE FROM codigos_lidos";
            $cordovaSQLite.execute(db, sql);
        }

        $scope.insertAll = function(){
            logaRegistros()

            $scope.poc.initial = Date.now();
            var pro = insertAllTransaction();
            pro.then(function(){
                $scope.poc.final = Date.now();
                $scope.poc.total = ($scope.poc.final - $scope.poc.initial) / 1000;
                console.log('Finalizou transação')
                logaRegistros();
                //limparBanco(); 
            });
        }
    })
