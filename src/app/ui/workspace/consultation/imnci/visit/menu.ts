namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;

        static $inject = ["$stateParams"];
        constructor(params: ng.ui.IStateParamsService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/visit/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVisitMenuLayout", new Component());

}
