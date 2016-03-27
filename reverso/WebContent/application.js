(function (angular) {
  "use strict";

  // Purposes of of the IIFE and parameters:
  // * Inform some IDEs that global access is intentional.
  // * Document use of globals.
  // * Protect from accidentaly overwrite.
  // * Rename locally ("ng")
  // * Robust access to the real Undefined.


    function WelcomeController() {
        this.who = 'World';
    }

  angular.module("reverso", ["palindromes", "ngRoute", "rzModule", "ui.bootstrap", "backand"])
     .config(
            function ($routeProvider, BackandProvider) {
			      BackandProvider.setAppName('reverso');
			      BackandProvider.setSignUpToken('000e7820-dca2-41f1-820f-a612011dc62e');
			      BackandProvider.setAnonymousToken('bddbb5e7-ecfa-433e-8d61-5e4de7af161f');
            	
                $routeProvider.
                when('/welcome', {
                    //routes define one "implicit component" per page
                    templateUrl: 'welcome.html',
                    controller: 'WelcomeController',
                    controllerAs: 'wc'
                }).
                when('/palindromes', {
                   template: '<palindromes palindromes="$resolve.palindromes"></palindromes>',
                    resolve: {
                        // This variant requires that the factory *is* a promise:
                        // "country": "CountryLoader"
                        // More typically a factory has a function which returns a promise;
                        // DI is available in a resolve function.
                        "palindromes": function ($route, palindromeService) {
                            // $routeParams is not updated until the route is resolved;
                            // use $route.current.params instead
                            return palindromeService.getList();
                        }
                    }
                }).
                otherwise({
                    redirectTo: '/welcome'
                });
            })
            .controller('WelcomeController', WelcomeController);



})(window.angular);

