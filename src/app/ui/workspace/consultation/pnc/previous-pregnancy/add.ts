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

        static $inject = ["$state", "$stateParams", "PncService", "DeliveryService", "InfantService", "PncChildService", "$q", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private pncService: data.IPncService,
            private deliveryService: data.IDeliveryService,
            private infantService: data.IInfantService,
            private pncChildService: data.IPncChildService,
            private q: ng.IQService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            console.log(params);
        }

        $onInit = (): void => {

        }

        closed = (deliveryId: string) => {
            let defer = this.q.defer();
            this.pncService.current(this.personId).then((response) => {
                console.log("response in menu");
                console.log(response.id);
                this.pnc = response;
                this.pncId = response.id;
                defer.resolve(true);
                let dlg = this.dialog.confirm("Pnc Registration", "Person already has Active Pnc record. Proceed to attend?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.pnc.overview");
                }, () => {
                    // this.state.go("consultation.management.pnc.previousPregnancies.list");
                    defer.resolve(false);
                });

            }, (error) => {

                this.deliveryService.get(deliveryId).then((response) => {
                    if ((moment().diff(response.date, "days") < 56) === true) {

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
                                                this.state.go("consultation.management.pnc.overview");
                                            });

                                        });
                                    });
                                });
                            });

                        });
                    } else {
                        this.state.go("consultation.management.pnc.previousPregnancies.list");


                    }
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

    app.component("mrsConsultationPatientPncPreviousPregnanciesAddLayout", new Component());

}
