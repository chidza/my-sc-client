namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Config {

        static $inject = ["$stateProvider"];
        constructor(stateProvider: ng.ui.IStateProvider) {
             stateProvider
                 .state("finishReset", {
                     url: "/reset/finish/:key",
                     component: "mrsResetFinish"
                 });

        }
    }

    app.config(Config);

}

