(function (angular) {
    "use strict";

    function PalindromeService($http, $timeout, $interval, $q, Backand) {
        var url = 'demo-data/palindromes.json';

        var ps = this;

        function log(param) {
            console.log(param);
            return param;
        }

        ps.query =[];
        ps.midpoint = [];
        ps.midpoint = [];
        
        // var workerPromise =  $http.get(url).then(unwrapResponse);
        var workerPromise =  $http({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/objects/' + "palindromes",
            params: {
              pageSize: 500,
              pageNumber: 1,
              filter: null,
              sort: ''
            }
          }).then(unwrapResponse);
 
        function unwrapResponse (response) {
        	var results = response.data["data"];
        	for (var index in results) {
        		   if ( results.hasOwnProperty(index)) {
        		      var obj = results[index];
        		      obj.smooth = obj.text.replace(/[^\w]/g, "").toUpperCase();
         		   }      	
        	}
            return  results;
        }
        ps.getList = function () {
            return workerPromise;
        };
        
//        ps.getList = function(sort, filter) {
//        	
//        	var responseObj = $http({
//                method: 'GET',
//                url: Backand.getApiUrl() + '/1/objects/' + "palindromes",
//                params: {
//                  pageSize: 160,
//                  pageNumber: 1,
//                  filter: filter || '',
//                  sort: sort || ''
//                }
//              });
//            return unwrapResponse(responseObj);
//            };

    }


    function PalindromeController() {
    	var pc = this;
    	pc.smoothed = smoothIt;
    	//var smoothTemp = pc.smoothed();
    	//pc.palindrome.smooth =  (smoothTemp[0] + smoothTemp[1] + smoothTemp[2]).trim();
        function smoothIt() {
        	var smootharray = isolateMidpoint(pc.palindrome.smooth, Number(pc.midpoint.text));
        	for(var i = 0; i < smootharray.length; i++){
        		smootharray[i] = smootharray[i].split('').join(' ') + ' ';
        	}
        		
    		return smootharray;
    	}


    	
    	pc.isPalindrome = isPalindrome;
        function isPalindrome() {
         	var str = pc.palindrome.smooth;
    		return  str == str.split('').reverse().join('');
    	}
    	pc.reverse = reverse;
       function reverse() {
         	var str = pc.palindrome.text;
 		    str = str.replace(/[^\w]/g, "").toUpperCase();

    		return str.split('').reverse().join(' ');
    	}
    	
    }


    function PalindromeListController(palindromeService) {
        var plc = this;
        plc.query =  palindromeService.query;
        plc.midpoint = palindromeService.midpoint;
        palindromeService.getList().then(function(data){
             plc.palindromes = data;
         });
        plc.pluralize = pluralize;
        function pluralize(input, num) {
    		return num == 1 ? input: input + "s";
    	}

        plc.turnaroundLengthSlider = {
            value: 8,
            options: {
                ceil: 16,
                floor: 0,
                step: 2,
                showTicks: true,
                ticksTooltip: function (v) {
                    return 'Even length: ' + v + ' chars. Odd length: ' + Math.max(v-1, 0) + ' chars.';
                }
            }
        };
    }

    function isolateMidpoint(input, size){
        if( !input || !angular.isString(input)) {
            return input;
        }

        var beg; var end;
        var midpointSize = (size && angular.isNumber(size)) ? size: 0; // Should be an even number
        if( input.length <= midpointSize) {
            beg = 0;
            end = input.length;
        }
        else {
            var remainder =  input.length % 2;
            beg = ((input.length  - midpointSize)/2) + remainder;
            end = beg + midpointSize - remainder;
        }
        var output = [input.slice(0, beg), input.slice(beg,end), input.slice(end, input.length)];
        return output;   
    }
    angular.module("palindromes", [])
        .service('palindromeService', PalindromeService)

        .component('palindromes', {
            templateUrl: 'components/palindrome/palindromes.html',
            controller: 'PalindromeListController',
            controllerAs: 'plc',
            bindings: {
                midpoint : '<',
                turnaroundLengthSlider : '<'
             }
       })
        .component('palindrome', {
            templateUrl: 'components/palindrome/palindrome.html',
            bindings: {
                palindrome : '=',
                midpoint : '='
             },
            controller: 'PalindromeController',
            controllerAs: 'pc'
        })
        .controller('PalindromeController',PalindromeController)
        .controller('PalindromeListController',PalindromeListController);
    //.factory("promiseSleep", function ($timeout) {
        //    return function (ms) {
        //        return function (value) {
        //            return $timeout(function () {
        //                return value;
        //            }, ms);
        //        };
        //    };
        //});

})(window.angular);

