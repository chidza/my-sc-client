namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncInformation extends ng.IController {

    }

    class Controller implements IAncInformation {

        ancInformation = {} as data.IInformation;
        hivStatus: data.IHivStatus;
        dateOfAdmission: Date;
        deliveryId: string;
        rupturedMembranes: string;

        static $inject = ["AncService", "PersonService", "AdmissionService", "DeliveryService", "DeliveryHistoryService"];
        constructor(private ancService: data.IAncService,
            private personService: data.IPersonService,
            private admissionService: data.IAdmissionService,
            private deliveryService: data.IDeliveryService,
            private deliveryHistoryService: data.IDeliveryHistoryService
        ) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {

                this.deliveryService.get(this.deliveryId).then((response) => {
                    console.log(response);
                    this.dateOfAdmission = response.date;
                    this.ancService.getInformation(response.personId).then((response) => {
                        this.ancInformation = response;
                    });

                    this.personService.hivStatus(response.personId, new Date()).then((reponse) => {
                        this.hivStatus = reponse;
                    });

                    this.deliveryHistoryService.get(response.historyId).then((response) => {

                        response.membranesRuptured ? this.rupturedMembranes = "Yes Time: " + moment(response.timeOfRupture).format("YYYY-MM-DD HH:mm") : this.rupturedMembranes = "No";
                    });
                    /*this.admissionService.get(response.admissionId).then((response) => {
                        this.dateOfAdmission = response.admitted;
                    });*/
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/delivery-information/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<"

            };

        }
    }

    app.component("mrsDeliveryAncInformation", new Component());

}
