namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramDrugList extends ng.IController {

    }

    class Controller implements IPartogramDrugList {
        medicationList: Array<data.IPartogramDrugList> = [];
        personId: string;
        encounterId: string;
        date: string;
        refreshMedication: number = 1;


        static $inject = ["PersonMedicationService", "dialogs", "DispenseService", "$uibModal"];
        constructor(private personMedicationService: data.IPersonMedicationService,
            private dialog: ng.dialogservice.IDialogService,
            private dispenseService: data.IDispenseService,
            private modal: ng.ui.bootstrap.IModalService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId && this.date) {
                this.dispenseService.getByPersonIdAndDate(this.personId, this.date).then((response) => {
                    this.medicationList = response;
                });
            }
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
        add = () => {
            let header = "Medications List";
            let body = `<mrs-select-add-dialog select-medication-formulation="vm.select(medicationId)" closed="vm.close()"></mrs-select-add-dialog>`;

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
                    this.addMedication(id);
                });
        }

        addMedication = (id: string) => {
            let callback = this;
            let header = "Medication Add";
            let body = `<mrs-encounter-dispense-dialog encounter-id = "vm.data.encounterId" person-id="vm.data.personId" drug-id="vm.data.id" 
            dispense-id="-1" saved="vm.close()" date="vm.data.date"
            closed="vm.close() "></mrs-encounter-dispense-dialog>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: ["data", function (data: any) {

                    this.data = data;

                    this.close = function () {
                        modalInstance.close();
                    };

                }],
                template: template,
                controllerAs: "vm",
                size: "lg",
                backdrop: "static",
                resolve: {
                    data: {
                        id: id,
                        personId: callback.personId,
                        date: callback.date,
                        encounterId: callback.encounterId
                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.init();
                });
        }

        edit = (item: data.IPartogramDrugList) => {

            let d: data.IDispense;
            let callback = this;

            this.dispenseService.get(item.dispenseId).then((response) => {
                d = response;
                let header = "Medication Edit";
                let body = `<mrs-dispense-dialog person-id="vm.data.personId" drug-id="vm.data.drugId" 
            dispense-id="vm.data.id" saved="vm.close()" closed="vm.close() "></mrs-dispense-dialog>`;

                let footer = "";

                let template: string = this.modelTemplate(header, body, footer);

                let modalInstance = this.modal.open({
                    controller: ["data", function (data: any) {

                        this.data = data;

                        this.close = function () {
                            modalInstance.close();
                        };

                    }],
                    template: template,
                    controllerAs: "vm",
                    size: "lg",
                    backdrop: "static",
                    resolve: {
                        data: {
                            drugId: d.drugId,
                            personId: callback.personId,
                            id: d.id,
                        }
                    }
                });

                modalInstance.result.then(
                    () => {
                        this.init();
                    });

            });
        }
        delete = (item: data.IPartogramDrugList) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.personMedicationService.remove(item.personMedicationId).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/drugs/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                encounterId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPartogramDrugList", new Component());

}
