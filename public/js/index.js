angular.module('RESTDocApp', ['ngAnimate'])
    .controller('RESTDocController', ['$scope', function($scope){
        $scope.restDocReady = false;
        $scope.message = 'hello!';
        $scope.query = '';
        $scope.RESTData = {
            endpoint: '',
            output: '{\nfoo:\'bar\'\n}',
            input: '{\nbar:\'foo\'\n}',
            actions: ['sudo make me a sandwich']
        };
        $scope.sendData = function(){
            var ajaxReq = $.ajax({
                method: 'PUT',
                url: '/restdoc/update',
                data: {data: JSON.stringify($scope.RESTData)}
            });
            ajaxReq.done(function(data){
                console.log('apparently it is done', data);
            });
        };
        $scope.addAction = function(){
            $scope.RESTData.actions.push('');
        };
        $scope.removeAction = function(n){
            $scope.RESTData.actions.splice(n,1);
        };
        $scope.requestSearch = function(){
            var ajaxReq = $.ajax({
                method: 'GET',
                url: '/restdoc/search?q='+$scope.query
            });
            ajaxReq.done(function(data){
                if(data.data.length !== 0){
                    console.log('found it!');
                    console.log(data.data[0]);
                    $scope.RESTData = data.data[0];
                    $scope.restDocReady = true;
                    $scope.$digest();
                } else {
                    console.log('nothing was found');
                }
            });
        };
    }]);