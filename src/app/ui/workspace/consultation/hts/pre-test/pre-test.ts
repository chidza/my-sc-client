namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        htsId: string;

        static $inject = ["$stateParams"];
        constructor(params: ng.ui.IStateParamsService) {
            this.htsId = params["htsId"];
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/hts/pre-test/pre-test.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientHtsPreTestLayout", new Component());

}
