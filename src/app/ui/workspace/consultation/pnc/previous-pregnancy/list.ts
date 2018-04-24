namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;
        pncId: string;
        pnc = {} as data.IPnc;
        delivery = {} as data.IDelivery;


        static $inject = ["$state", "$stateParams", "PncService", "DeliveryService", "InfantService", "PncChildService", "dialogs", "$q"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private pncService: data.IPncService,
            private deliveryService: data.IDeliveryService,
            private infantService: data.IInfantService,
            private pncChildService: data.IPncChildService,
            private dialog: ng.dialogservice.IDialogService,
            private q: ng.IQService) {
            this.personId = params["personId"];
            this.pncId = params["pncId"];
        }


        view = () => {

        }

        edit = (id: string) => {
            this.state.go("consultation.management.pnc.previousPregnancies.edit", { previousAncId: id });
        }

        add = () => {
            this.state.go("consultation.management.pnc.previousPregnancies.add");
        }

        use = (deliveryId: string): void => {
            console.log("deliveryId again in shell");
            console.log(deliveryId);
            console.log("personId again in shell");
            console.log(this.personId);
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

                let dlg = this.dialog.confirm("PNC Registration", "Are you sure you want to create PNC using the selected record?");
                dlg.result.then((btn) => {


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
                }, () => {
                    this.state.go("consultation.management.pnc.previousPregnancies.list");

                });
            });



        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/previous-pregnancy/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientPncPreviousPregnanciesListLayout", new Component());

}
