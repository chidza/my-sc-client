namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;
        ancId: string;
        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.ancId = params["previousAncId"];
        }

        close = () => {
            this.state.go("consultation.management.pnc.previousPregnancies.list");
        }

        edit = (infantId: string) => {
            this.state.go("consultation.management.pnc.previousPregnancies.editInfant", { infantId: infantId })
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/previous-pregnancy/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientPncPreviousPregnanciesEditLayout", new Component());

}
