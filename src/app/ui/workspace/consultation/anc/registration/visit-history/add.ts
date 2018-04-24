namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        queueId: string;
        ancId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.queueId = params["workareaId"];
            this.ancId = params["ancId"];
        }

        close = () => {
            if (this.ancId) {
                this.state.go("consultation.management.ancregistration.visitHistory.list", { ancId: this.ancId });
            }


        }
        saved = (visitId: string) => {
            this.state.go("consultation.management.ancregistration.visitHistory.edit", { ancId: this.ancId, visitId: visitId });
        }


    }

    class Component implements ng.IComponentOptions {


        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/visit-history/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
        }
    }

    app.component("mrsConsultationPatientAncVisitHistoryAddLayout", new Component());

}
