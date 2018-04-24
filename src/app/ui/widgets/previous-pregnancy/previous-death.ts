namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPreviousDeathDialog extends ng.IController {
        saved: () => void;
    }

    class Controller implements IPreviousDeathDialog {
        public saved: () => void;
        infantId: string;
        deliveryId: string;
        infant = {} as data.IInfant;
        foetal = {} as data.IFoetalDeath;
        date: string;

        static $inject = ["DeliveryService", "FoetalDeathService", "InfantService", "DiagnosisService", "$uibModal", "PersonDiagnosisService", "dialogs"];
        constructor(private deliveryService: data.IDeliveryService,
            private foetalDeathService: data.IFoetalDeathService,
            private infantService: data.IInfantService,
            private diagnosisService: data.IDiagnosisService,
            private modal: ng.ui.bootstrap.IModalService,
            private personDiagnosisService: data.IPersonDiagnosisService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {
            if (this.deliveryId) {
                this.infantService.get(this.infantId).then((response) => {
                    this.infant = response;
                    this.foetalDeathService.getByInfantId(this.infant.id).then((response) => {
                        this.foetal = response;
                    });

                }, (error) => {
                    this.infant.time = new Date(this.date);
                    this.infant.outcome = "DEAD";
                    this.infant.deliveryId = this.deliveryId;
                });
            }

        }

        save = () => {
            this.foetal.time = this.infant.time;
            if (this.infant.id) {
                this.infantService.update(this.infant).then((response) => {
                    this.foetalDeathService.update(this.foetal).then((response) => {
                        this.saved();
                    });
                });
            } else {
                if (this.infant.deliveryMethod && this.foetal.stillBirthType && this.foetal.gender) {
                    this.infantService.save(this.infant).then((response) => {
                        this.foetalDeathService.getByInfantId(response.id).then((foetal) => {
                            this.foetal.id = foetal.id;
                            this.foetal.infantId = foetal.infantId;
                            this.foetalDeathService.update(this.foetal).then((response) => {
                                this.saved();
                            });
                        });
                    });
                }
            }

        }

    }


    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/previous-pregnancy/previous-death.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                saved: "&",
                infantId: "<",
                deliveryId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPreviousDeathDialog", new Component());

}
