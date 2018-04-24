namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeathDialog extends ng.IController {
        closed: () => void;
        saved: () => void;
    }

    class Controller implements IDeathDialog {
        public closed: () => void;
        public saved: () => void;
        delivery: data.IDelivery;
        diagnosis: data.IDiagnosis;
        infantId: string;
        deliveryId: string;
        infant = {} as data.IInfant;
        foetal = {} as data.IFoetalDeath;
        datePickerOpenStatus = {};
        personDiagnosis = {} as data.IPersonDiagnosis;

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
                        if (this.foetal.diagnosisId) {
                            this.personDiagnosisService.get(this.foetal.diagnosisId).then((response) => {
                                this.personDiagnosis = response;
                                if (response.diagnosisId) {
                                    this.diagnosisService.get(response.diagnosisId).then((response) => {
                                        this.diagnosis = response;
                                    });
                                }
                            });
                        }
                    });

                }, (error) => {

                    this.infant.time = new Date();
                    this.infant.outcome = "DEAD";
                    this.infant.deliveryId = this.deliveryId;



                });
            }

            if (this.deliveryId) {
                this.deliveryService.get(this.deliveryId).then((response) => {
                    this.delivery = response;
                    console.log("delivery");
                    console.log(this.delivery);
                });
            }


        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }
        save = () => {
            this.foetal.time = this.infant.time;
            console.log(this.infant);
            if (this.infant.id) {
                this.personDiagnosisService.update(this.personDiagnosis).then((response) => {
                    this.infantService.update(this.infant).then((response) => {
                        this.foetalDeathService.update(this.foetal).then((response) => {
                            this.saved();
                        });
                    });
                });

            } else {
                console.log(this.infant);
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
        close = () => {
            if (!this.foetal.id && this.foetal.diagnosisId) {
                this.personDiagnosisService.remove(this.foetal.diagnosisId).then((response) => {
                    this.closed();
                });
            } else {
                this.closed();
            }

        }

        changeDiagnosis = () => {
            let header = "Diagnosis List";

            let body = `<mrs-diagnosis-select select-diagnosis="vm.select(id)">
            </mrs-diagnosis-select>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: function () {
                    this.select = function (id: string) {
                        modalInstance.dismiss(id);
                    };

                    this.close = function () {
                        modalInstance.close();
                    };

                },
                template: template,
                controllerAs: "vm",
                size: "lg",
                backdrop: "static",
            });

            modalInstance.result.then(
                () => {
                },
                (id) => {
                    this.diagnosisService.get(id).then((response) => {
                        this.diagnosis = response;
                    });
                    this.personDiagnosis.diagnosisId = id;
                    if (!this.personDiagnosis.id) {
                        this.personDiagnosis.date = this.infant.time;
                        this.personDiagnosis.personId = this.delivery.personId;
                        this.personDiagnosis.definitive = false;
                        this.personDiagnosis.finalDiagnosis = true;
                        this.personDiagnosis.working = true;
                        this.personDiagnosis.differential = false;
                        this.personDiagnosisService.save(this.personDiagnosis).then((response) => {
                            this.foetal.diagnosisId = response.id;
                        });
                    }

                });
        }

        modelTemplate = (header: string, body: string, footer: string) => {
            return `<div class="modal-header">           
                  <h4 class="modal-title">` + header + `</h4>
              </div>
              <div class="modal-body">
                <br/>` +
                body +
                ` <br></div>
              <div class="modal-footer">`
                + footer +
                `</div>`;
        }
    }


    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/infant/death-dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                closed: "&",
                saved: "&",
                infantId: "<",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsDeathDialog", new Component());

}
