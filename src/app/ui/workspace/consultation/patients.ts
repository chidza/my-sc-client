namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        workspaceId: string;
        workareaId: string;
        workareaTitle: string;
        personId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];

            switch (this.workspaceId) {
                case "opd":
                    this.workareaTitle = "Queue";
                    break;
                case "admission":
                    this.workareaTitle = "Ward";
                    break;
            }

        }

        changeWorkArea = () => {
            this.state.go("consultation.workspace");
        }

        patientManagement = () => {
            this.state.go("consultation.purpose.list", { workareaId: this.workareaId, personId: this.personId });
        }

        onPersonSelected = (personId: string) => {
            this.personId = personId;
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/patients.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientSelectionLayout", new Component());

}