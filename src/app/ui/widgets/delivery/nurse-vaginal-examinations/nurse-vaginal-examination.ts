namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface INurseVaginalExaminationDialog extends ng.IController {

    }

    class Controller implements INurseVaginalExaminationDialog {

        deliveryId: string;
        nurseVaginalExamination: data.INurseVaginalExamination;

        static $inject = ["DeliveryService", "NurseVaginalExaminationService"];
        constructor(private deliveryService: data.IDeliveryService,
            private nurseVaginalExaminationService: data.INurseVaginalExaminationService) {

        }


        $onInit = () => {

            this.deliveryService.get(this.deliveryId).then((delivery) => {

                this.nurseVaginalExaminationService.get(delivery.nurseExaminationId).then((response) => {
                    this.nurseVaginalExamination = response;
                }, (error) => {

                    // create nurse delivery object
                    this.nurseVaginalExaminationService.saveNurseVaginalExamination(this.deliveryId, {
                        applicationToPresentingPart: "NOT_APPLIED",
                        position: "ROA",
                        liquor: "NONE",
                    } as data.INurseVaginalExamination).then((response) => this.nurseVaginalExamination = response);

                });

            });

        }

        update = () => {
            this.nurseVaginalExaminationService.update(this.nurseVaginalExamination).then((response) => {
                console.log("update.......");
                console.log(response);

            }, (error) => {
                console.log("error wamhanya 2");
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/nurse-vaginal-examinations/nurse-vaginal-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<"
            };

        }
    }

    app.component("mrsNurseVaginalExaminationDialog", new Component());

}
