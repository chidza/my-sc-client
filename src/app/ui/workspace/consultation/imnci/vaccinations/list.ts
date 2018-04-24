namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        workspaceId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];
        }


        add = (): void => {
            this.state.go("consultation.management.imnci.vaccinations.select");
        }

        edit = (id: string, dispenseId: string): void => {
            if (dispenseId) {
                this.state.go("consultation.management.imnci.vaccinations.edit", { dispenseId: dispenseId });
            } else {
                this.state.go("consultation.management.imnci.vaccinations.history", { personMedicationId: id });
            }

        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/vaccinations/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVaccinationListLayout", new Component());

}
