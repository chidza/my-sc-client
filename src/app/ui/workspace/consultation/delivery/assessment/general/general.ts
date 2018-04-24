namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workspaceId: string;
        deliveryId: string;
        encounterId: string;
        nurseGeneralExaminationId: string;
        doctorGeneralExaminationId: string;


        static $inject = ["$stateParams", "DeliveryService"];
        constructor(params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
            this.workspaceId = params["workspaceId"];
        }

        $onInit = () => {
            this.deliveryService.get(this.deliveryId).then((response) => {
                this.nurseGeneralExaminationId = response.nurseGeneralExaminationId;
                this.doctorGeneralExaminationId = response.doctorGeneralExaminationId;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/assessment/general/general.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryAssessmentGeneralLayout", new Component());

}
