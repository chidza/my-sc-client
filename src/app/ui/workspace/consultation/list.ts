namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;

        static $inject = ["$stateParams"];
        constructor(params: ng.ui.IStateParamsService) {
            console.log("params",params);
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPurposeListLayout", new Component());

}
