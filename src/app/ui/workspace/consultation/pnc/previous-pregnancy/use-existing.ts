namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;
        pncVisitId: string;
        pnc = {} as data.IPnc;
        delivery = {} as data.IDelivery;
        pncId: string;

        static $inject = ["$state", "$stateParams", "PncService", "DeliveryService", "InfantService", "PncChildService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private pncService: data.IPncService,
            private deliveryService: data.IDeliveryService,
            private infantService: data.IInfantService,
            private pncChildService: data.IPncChildService) {
            this.personId = params["personId"];
        }

        $onInit = (): void => {

        }

        closed = (deliveryId: string) => {
            console.log("deliveryId again in shell");
            console.log(deliveryId);

            // fetch infants for the selected delivery
            this.infantService.getByDeliveryId(deliveryId).then((response) => {
                this.pnc.date = new Date();
                this.pnc.personId = this.personId;

                // create a new pnc record
                this.pncService.save(this.pnc).then((pnc) => {
                    this.deliveryService.get(deliveryId).then((delivery) => {
                        delivery.pncId = pnc.id;

                        // update delivery with the newly created pnc record id
                        this.deliveryService.update(delivery).then(() => {

                            // loop for children
                            response.forEach((infant) => {
                                let child = {} as data.IPncChild;
                                child.personId = infant.personId;
                                child.pncId = pnc.id;

                                // add child to pnc child
                                this.pncChildService.save(child).then((response) => {
                                    ///this.$router.navigate(["PncOverview", { personId: this.personId, opdId: this.opdId, queueId: this.queueId }]);
                                    this.state.go("consultation.management.pnc.overview");
                                });

                            });
                        });
                    });
                });

            });

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/previous-pregnancy/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

            };

        }
    }

    app.component("mrsConsultationPatientPncPreviousPregnanciesAddExistingLayout", new Component());

}
