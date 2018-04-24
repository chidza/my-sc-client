namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMaternalDeathDialog extends ng.IController {
        closed: () => void;
        saved: (maternalDeathId: Object) => void;
        addDiagnosis: () => void;
    }


    class Controller implements IMaternalDeathDialog {
        deliveryId: string;
        diagnosisId: string;
        maternalDeath = {} as data.IMaternalDeath;
        maternaldeathfactors: Array<data.IMaternalDeathFactor> = [];
        personDiagnosis = {} as data.IPersonDiagnosis;
        outcome: string;
        diagnosis: data.IDiagnosis;
        diagnosisName: string;
        personId: string;
        public closed: () => void;
        public saved: (maternalDeathId: Object) => void;
        public addDiagnosis: () => void;
        datePickerOpenStatus = {};
        avoidable: string[] = ["YES", "NO", "UNSURE"];


        static $inject = ["MaternalDeathService", "MaternalDeathFactorService", "dialogs",
            "DiagnosisService", "PersonDiagnosisService", "$uibModal", "DeliveryService"];
        constructor(private maternalDeathService: data.IMaternalDeathService,
            private maternalDeathFactorService: data.IMaternalDeathFactorService,
            private dialog: ng.dialogservice.IDialogService,
            private diagnosisService: data.IDiagnosisService,
            private personDiagnosisService: data.IPersonDiagnosisService,
            private modal: ng.ui.bootstrap.IModalService,
            private deliveryService: data.IDeliveryService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {
                this.maternalDeathService.getByDelivery(this.deliveryId).then((response) => {
                    this.maternalDeath = response;
                    if (this.maternalDeath.diagnosisId) {
                        this.personDiagnosisService.get(this.maternalDeath.diagnosisId).then((response) => {
                            this.personDiagnosis = response;
                            this.diagnosisService.get(this.personDiagnosis.diagnosisId).then((response) => {
                                this.diagnosis = response;
                            });
                        });
                    }
                }, (error) => {
                    this.maternalDeath.date = new Date();
                    this.maternalDeath.time = new Date();
                    this.maternalDeath.deliveryId = this.deliveryId;
                });

                this.deliveryService.get(this.deliveryId).then((response) => {
                    this.personId = response.personId;
                });
            }
        }


        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            if (this.maternalDeath.id !== "") {
                this.onSave(this.maternalDeathService.update(this.maternalDeath));
            }
            else {
                this.onSave(this.maternalDeathService.save(this.maternalDeath));
            }
        }

        onSave = (promise: ng.IPromise<data.IMaternalDeath>) => {
            promise.then((response) => {
                this.maternalDeath = response;
            }, () => {
            });
        }
        close = () => {
            this.closed();
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
                        this.personDiagnosis.date = this.maternalDeath.date;
                        this.personDiagnosis.personId = this.personId;
                        this.personDiagnosis.definitive = false;
                        this.personDiagnosis.finalDiagnosis = true;
                        this.personDiagnosis.working = false;
                        this.personDiagnosis.differential = false;
                        this.personDiagnosisService.save(this.personDiagnosis).then((response) => {
                            this.personDiagnosis = response;
                            this.maternalDeath.diagnosisId = response.id;
                        });
                    } else {
                        this.personDiagnosisService.update(this.personDiagnosis).then((response) => {
                            this.personDiagnosis = response;
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
            public templateUrl = " app/ui/widgets/delivery/maternal-death/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                diagnosisId: "<",
                "addDiagnosis": "&"
            };

        }
    }

    app.component("mrsMaternalDeathDialog", new Component());

}
