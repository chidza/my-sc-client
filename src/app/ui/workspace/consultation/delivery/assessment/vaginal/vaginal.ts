namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        deliveryId: string;
        nurseVaginalExaminationId: string;
        doctorVaginalExaminationId: string;


        static $inject = ["$stateParams", "DeliveryService"];
        constructor(params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
            this.deliveryId = params["deliveryId"];
        }

        $onInit = () => {
            this.deliveryService.get(this.deliveryId).then((response) => {
                console.log("response from chiremba");
                 console.log(response);
                this.nurseVaginalExaminationId = response.nurseGeneralExaminationId;
                this.doctorVaginalExaminationId = response.doctorGeneralExaminationId;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/assessment/vaginal/vaginal.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryAssessmentVaginalLayout", new Component());

}
