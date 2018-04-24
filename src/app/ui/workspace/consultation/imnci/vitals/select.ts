namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$state"];
        constructor(private state: ng.ui.IStateService) {
        }

        select = (id: string) => {
            this.state.go("consultation.management.imnci.vitals.add", { vitalId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/vitals/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientImnciVitalSelectLayout", new Component());

}