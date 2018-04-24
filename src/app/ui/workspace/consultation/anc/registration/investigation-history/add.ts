namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientInvestigationHistoryAdd extends ng.IController {

    }

    class Controller implements IArtPatientInvestigationHistoryAdd {

        $router: any;
        personInvestigationId: string = "";
        personId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {

        }

        onSelect = (id: string) => {
            this.state.go("consultation.management.ancregistration.investigationHistory.edit", { personInvestigationId: this.personInvestigationId, investigationId: id });

        }

        onCancel = () => {
             this.state.go("consultation.management.ancregistration.investigationHistory.list");

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/investigation-history/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationAncDeliveryInvestigationHistoryAddLayout", new Component());

}
