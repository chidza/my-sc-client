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
            this.state.go("consultation.management.deliveryRegistration.investigation.edit", { personInvestigationId: this.personInvestigationId, investigationId: id });

        }

        onCancel = () => {
             this.state.go("consultation.management.deliveryRegistration.investigation");

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/history/investigation-history/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryInvestigationHistoryAddLayout", new Component());

}
