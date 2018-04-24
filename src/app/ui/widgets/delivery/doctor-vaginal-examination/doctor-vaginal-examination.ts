namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDoctorVaginalExaminationDialog extends ng.IController {

    }

    class Controller implements IDoctorVaginalExaminationDialog {

        deliveryId: string;
        doctorVaginalExamination: data.IDoctorVaginalExamination;

        static $inject = ["DeliveryService", "DoctorVaginalExaminationService"];
        constructor(private deliveryService: data.IDeliveryService,
            private doctorVaginalExaminationService: data.IDoctorVaginalExaminationService) {

        }

        $onInit = () => {

            this.deliveryService.get(this.deliveryId).then((delivery) => {

                this.doctorVaginalExaminationService.get(delivery.doctorExaminationId).then((response) => {
                    this.doctorVaginalExamination = response;
                }, (error) => {

                    // create doctor delivery object
                    this.doctorVaginalExaminationService.saveDoctorVaginalExamination(this.deliveryId, {
                        applicationToPresentingPart: "NOT_APPLIED",
                        position: "ROA",
                        liquor: "NONE",
                    } as data.IDoctorVaginalExamination).then((response) => this.doctorVaginalExamination = response);

                });

            });

        }

        update = () => {
            this.doctorVaginalExaminationService.update(this.doctorVaginalExamination).then((response) => {
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/doctor-vaginal-examination/doctor-vaginal-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<"
            };

        }
    }

    app.component("mrsDoctorVaginalExaminationDialog", new Component());

}
