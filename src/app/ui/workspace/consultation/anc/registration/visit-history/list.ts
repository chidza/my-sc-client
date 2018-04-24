namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        ancId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.ancId = params["ancId"];
        }

        onAdd = () => {
            if (this.ancId) {
                this.state.go("consultation.management.ancregistration.visitHistory.add", { ancId: this.ancId });
            }

        }

        onEdit = (visitId: string) => {
            this.state.go("consultation.management.ancregistration.visitHistory.edit", { ancId: this.ancId, visitId: visitId });
        }
    }

    class Component implements ng.IComponentOptions {
        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/visit-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientAncVisitHistoryListLayout", new Component());

}
