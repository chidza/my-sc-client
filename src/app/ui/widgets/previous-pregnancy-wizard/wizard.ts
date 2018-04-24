namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPreviousPregnancyWizard extends ng.IController {
        close: (deliveryId: Object) => void;
        infantId: (infantId: Object) => void;
    }

    class Controller implements IPreviousPregnancyWizard {

        public close: (deliveryId: Object) => void;
        public infantId: (infantId: Object) => void;
        personId: string;
        ancId: string;
        deliveryId: string;
        minimum: boolean;
        reset: boolean;
        childId: string;
        currentOutcome: string;
        date: string;
        refresh: number = 0;
        infant = {} as data.IInfant;

        static $inject = ["$state", "$stateParams", "AncService", "DeliveryTypeService", "DeliveryService", "InfantService", "dialogs"];
        constructor(
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancService: data.IAncService,
            private deliveryTypesService: data.IDeliveryTypeService,
            private deliveryService: data.IDeliveryService,
            private infantService: data.IInfantService,
            private dialog: ng.dialogservice.IDialogService
        ) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.ancId) {
                this.ancService.get(this.ancId).then((response) => {
                    this.deliveryId = response.deliveryId;
                    this.deliveryService.get(this.deliveryId).then((response) => {
                        this.date = moment(response.date).format("YYYY-MM-DD");
                    });
                });
            }
        }

        saved = (deliveryId: string, ancId: string) => {
            this.ancId = ancId;
            this.deliveryId = deliveryId;
            if (this.deliveryId && this.ancId) {
                this.deliveryService.get(this.deliveryId).then((response) => {
                    this.date = moment(response.date).format("YYYY-MM-DD");
                });
                this.infantService.getByDeliveryId(this.deliveryId).then((response) => {
                    if (response.length > 0) {
                        this.minimum = true;
                    }
                });
            } else {
                this.minimum = true;
            }
        }

        birthOutcome = (outcome: string) => {
            this.currentOutcome = outcome;
            this.reset = false;
        }

        createStillInfant = () => {
            if (this.infant.id) {
                this.infantService.update(this.infant).then((response) => {
                    this.infant = response;
                });
            } else {
                this.infant.deliveryId = this.deliveryId;
                this.infant.time = new Date(this.date);
                this.infant.outcome = "DEAD";

                this.infantService.save(this.infant).then((response) => {
                    this.infant = response;
                });
            }

        }

        personSelected = (id: string) => {
            this.infantService.getByChildId(id).then((response) => {

                let dlg = this.dialog.error("Warning", " Patient is linked to another delivery! Please pick a different one.");
                dlg.result.then((btn) => {

                });
            }, () => {
                this.childId = id;
            });

        }

        childSaved = () => {
            this.currentOutcome = null;
            this.reset = true;
            this.minimum = true;
            this.refresh++;
            this.close({ deliveryId: this.deliveryId });
        }

        editBirthDetails = (id: string) => {

            this.infantId({ infantId: id });
        }

        closed = (deliveryId: string): void => {

            this.close({ deliveryId: deliveryId });
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/previous-pregnancy-wizard/wizard.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                infantId: "&",
                personId: "<",
                ancId: "<",
                close: "&"
            };

        }
    }

    app.component("mrsPreviousPregnancyWizard", new Component());

}
