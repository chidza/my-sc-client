namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonInvestigationList extends ng.IController {
        adding: () => void;
        editing: (personInvestigationId: Object) => void;
    }

    class Controller implements IPersonInvestigationList {
        personId: string;
        investigationHistory: Array<data.IInvestigationHistoryList> = [];
        public adding: () => void;
        public editing: (personInvestigationId: Object) => void;
        ids: string[] = [];
        investigationResults: data.IResult[] = [];

        static $inject = ["$state", "$stateParams", "PersonInvestigationService", "InvestigationResultService", "dialogs"];
        constructor(private state: ng.ui.IStateService, private params: ng.ui.IStateParamsService,
            private personInvestigationService: data.IPersonInvestigationService,
            private investigationResultService: data.IInvestigationResultService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
        }

        onAdd = () => {
            this.state.go("consultation.management.deliveryRegistration.investigation.add");

        }

        onEdit = (id: string) => {
            this.personInvestigationService.get(id).then((response) => {
                this.state.go("consultation.management.deliveryRegistration.investigation.edit", { personId: this.personId, personInvestigationId: id, investigationId: response.investigationId });

            });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/history/investigation-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryInvestigationHistoryListLayout", new Component());

}
