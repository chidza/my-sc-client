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
            this.ancId = params["ancId"];
        }


    }

    class Component implements ng.IComponentOptions {


        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/medical-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
        }
    }

    app.component("mrsConsultationPatientAncMedicalHistoryLayout", new Component());

}
