var app = angular.module("birlWeb", ['ui.ace']);


app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
}]);

//CONTROLLERS

app.controller("birlCtrl", function($scope, $window, birlService) {
    $scope.disabled = false;
    $scope.btText = "UAAAA!";
    $scope.stdin = "";
    $scope.stdout = "";
    $scope.code = "EAI PIAZADA\n    COM VOCES QUE EU ESTOU FALANDO (\"Hello, World! UAAAAA!\\n\");\n    MAGYVER HOJE VOCE EH UM HOMEM FORMADO 0;\nADEUS PIAZADA";
    $scope.temErro = false;

    $scope.sendBirl = function(){
        $scope.disabled = true;
        $scope.btText = "Buscando...";
        $scope.temErro = false;
        $scope.stdout = "";
        birlService.runBirl($scope.code, $scope.stdin).then(function(data){
            $scope.stdout = data;
        }, function(error){
            if(error == "server-error") {
                $scope.stdout = "NÃO VAI DAR NÃO, SERVIDOR CAIU";
            } else {
                $scope.stdout = "VOCE SO TA FAZENDO UM ERRO, TEM QUE IR SEM CAPACETE";
            }
            $scope.temErro = true;
        }).finally(function(){
            $scope.disabled = false;
            $scope.btText = "UAAAA!";
        });
    }

    var blob;

    //observar o codigo e alterar o blob
    $scope.$watch('code', function() {
        blob = new Blob([$scope.code], { type: 'text/plain' }),
        url = $window.URL || $window.webkitURL;
        $scope.fileUrl = url.createObjectURL(blob);
    });

});

//SERVICES

app.service("birlService", function($http, $q) {
    this.runBirl = function(code, stdin){
        var deferred = $q.defer();
        $http.post("https://uaaa.herokuapp.com/compile", {code: code, stdin: stdin }).then(function(response){
            data = response.data;
            if(data.error) {
                deferred.reject("compile-error");
            } else {
                deferred.resolve(data.stdout);
            }
        },function(error){
            deferred.reject("server-error");
        });
        return deferred.promise;
    }
});