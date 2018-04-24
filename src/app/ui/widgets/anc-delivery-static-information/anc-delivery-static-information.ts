namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncInformation extends ng.IController {

    }

    class Controller implements IAncInformation {

        personId: string;
        deliveryId: string;
        ancInformation = {} as data.IInformation;
        hivStatus: data.IHivStatus;
        dateOfAdmission: Date;
        timeOfMembraneRapture: Date;
        time: Date;
        width: number;
        names: string;
        positiveId: string;
        negativeId: string;
        indeteminantId: string;
        result: String;

        static $inject = ["AncService", "PersonService", "DeliveryService", "AdmissionService", "DeliveryHistoryService", "SiteSettingService"];
        constructor(private ancService: data.IAncService,
            private personService: data.IPersonService,
            private deliveryService: data.IDeliveryService,
            private admissionService: data.IAdmissionService,
            private deliveryHistoryService: data.IDeliveryHistoryService,
            private siteSettingService: data.ISiteSettingService
        ) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.personService.hivStatus(this.personId, new Date()).then((response) => {
                    this.hivStatus = response;

                    if (this.hivStatus.status.toLowerCase() === "positive") {
                        this.result = "1";
                    }
                    if (this.hivStatus.status.toLowerCase() === "negative") {
                        this.result = "0";
                    }
                    if (this.hivStatus.status.toLowerCase() === "unknown") {
                        this.result = "UNKNOWN";
                    }
                });

                this.personService.get(this.personId).then((reponse) => {
                    this.names = reponse.firstname + " " + reponse.lastname;
                });


                this.deliveryService.current(this.personId).then((response) => {
                    this.deliveryId = response.id;
                    this.ancService.getStaticAncInformation(this.deliveryId).then((response) => {
                        this.ancInformation = response;
                    });

                    this.admissionService.current(this.personId).then((response) => {

                        this.admissionService.get(response.admissionId).then((admission) => {
                            this.dateOfAdmission = admission.time;
                            this.time = admission.time;
                        });

                    });

                    this.deliveryHistoryService.get(response.historyId).then((reponse) => {
                        this.timeOfMembraneRapture = reponse.timeOfRupture;
                    });
                });

            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc-delivery-static-information/anc-delivery-static-information.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                width: "<"

            };

        }
    }

    app.component("mrsAncDeliveryStaticInformation", new Component());

}
