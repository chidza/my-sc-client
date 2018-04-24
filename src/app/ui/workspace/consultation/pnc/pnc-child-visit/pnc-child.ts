namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPnc extends ng.IController {

    }

    class Controller implements IPnc {
        workspaceId: string;
        queueId: string;
        personId: string;
        childId: string;
        pncId: string;
        encounterId: string;
        person: data.IPerson;
        motherPnc = {} as data.IPnc;
        pncVisit = {} as data.IPncVisit;
        refreshVital: number = 0;
        refreshMedication: number = 0;
        pncVisitId: string;
        pncvisittypes: Array<data.IPncVisitType> = [];


        static $inject = ["$state", "$stateParams", "PncService", "dialogs", "PncVisitService", "PncVisitTypeService", "OpdService",
            "PersonService", "OpdQueueService", "$uibModal", "PersonVitalService", "PrescriptionService", "ConsultationService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private pncService: data.IPncService,
            private dialog: ng.dialogservice.IDialogService,
            private pncVisitService: data.IPncVisitService,
            private pncVisitTypeService: data.IPncVisitTypeService,
            private opdService: data.IOpdService,
            private personService: data.IPersonService,
            private opdQueueService: data.IOpdQueueService,
            private modal: ng.ui.bootstrap.IModalService,
            private personVitalService: data.IPersonVitalService,
            private prescriptionService: data.IPrescriptionService,
            private consultationService: data.IConsultationService) {
            this.childId = params["childId"];
            this.personId = params["personId"];
            this.queueId = params["workareaId"];
            this.workspaceId = params["workspaceId"];
        }

        $onInit = (): void => {
            this.pncVisitTypeService.query().then((response) => {
                this.pncvisittypes = response;
            });

            this.personService.get(this.childId).then((response) => {
                this.person = response;
            });
            this.pncService.current(this.personId).then((pnc) => {
                this.motherPnc = pnc;
            });

            this.consultationService.pncChildEncounter(this.workspaceId, this.queueId, this.personId, this.childId).then((response) => {
                this.pncVisitId = response.pncVisitId;
                this.encounterId = response.encounterId;
                this.pncVisitService.get(this.pncVisitId).then((response) => {
                    this.pncVisit = response;
                   // this.updatePncVisitType();
                }, (error) => {
                    console.log("in error");
                    console.log(error);
                });
            });

        }


        save = (pncVisitTypeId: data.IPncVisitType) => {
            this.pncVisitService.update(this.pncVisit).then((response) => {
                this.pncVisit = response;
            });
        }
        updatePncVisitType = () => {
            this.consultationService.pncEncounter(this.workspaceId, this.queueId, this.personId).then((response) => {
                this.pncVisit.pncVisitTypeId = response.pncVisitTypeId;
                this.pncVisitService.update(this.pncVisit).then((visit) => {
                    this.pncVisit = visit;
                });
            });
        }
        childAge = (dob: Date): number => {
            let current = moment(new Date);
            let date = moment(dob);
            return current.diff(date, "days");
        }

        onClose = () => {
            this.state.go("consultation.management.pnc.overview");
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

        addVital = () => {
            let header = "Vital Signs List";

            let body = `<mrs-encounter-vital-select select-vital="vm.select(id)">
            </mrs-encounter-vital-select>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: function() {
                    this.select = function(id: string) {
                        modalInstance.dismiss(id);
                    };

                    this.close = function() {
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
                    this.createVital(id);
                });
        }
        createVital = (id: string) => {

            let callback = this;
            let header = "Vital Add";

            let body = `<mrs-encounter-vital-dialog encounter-id ="vm.data.encounterId" 
            person-vital-id = "-1" person-id = "vm.data.personId" 
            vital-id = "vm.data.id" saved = "vm.close()" closed = "vm.close()"></mrs-encounter-vital-dialog>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: ["data", function(data: any) {
                    this.data = data;
                    this.close = function() {
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
                        encounterId: callback.encounterId
                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.refreshVital = this.refreshVital + 1;
                });
        }
        editVital = (id: string) => {

            let callback = this;
            let header = "Vital Edit";

            let body = ` <mrs-encounter-vital-dialog   encounter-vital-id="vm.data.id" 
                saved="vm.close()" closed="vm.close()"></mrs-encounter-vital-dialog>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: ["data", function(data: any) {
                    this.data = data;
                    this.close = function() {
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
                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.refreshVital = this.refreshVital + 1;
                });
        }

        selectMedication = () => {
            let header = "Vital Signs List";

            let body = `<mrs-select-add-dialog select-medication-formulation="vm.select(medicationId)">
            </mrs-select-add-dialog>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: function() {
                    this.select = function(id: string) {
                        modalInstance.dismiss(id);
                    };

                    this.close = function() {
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
                    this.createMedication(id);
                });
        }

        createMedication = (id: string) => {
            let callback = this;
            let header = "Medication Add";

            let body = `
            <mrs-prescription-dialog encounter-id="vm.data.encounterId" prescription-id="-1" 
            person-id="vm.data.personId" medication-id="vm.data.id"
                saved="vm.close()" closed="vm.close()"></mrs-prescription-dialog>
            `;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: ["data", function(data: any) {
                    this.data = data;
                    this.close = function() {
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
                        encounterId: callback.encounterId
                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.refreshMedication = this.refreshMedication + 1;
                });
        }

        editMedication = (id: string) => {
            let callback = this;
            let d: data.IPrescription;
            this.prescriptionService.get(id).then((response) => {
                d = response;
                let header = "Medication Edit";

                let body = `
                <mrs-prescription-dialog prescription-id="vm.data.id" encounter-id="vm.data.encounterId" 
                person-id="vm.data.personId" saved="vm.close()"
                closed="vm.close()"></mrs-prescription-dialog>
                `;

                let footer = "";

                let template: string = this.modelTemplate(header, body, footer);

                let modalInstance = this.modal.open({
                    controller: ["data", function(data: any) {
                        this.data = data;
                        this.close = function() {
                            modalInstance.close();
                        };

                    }],
                    template: template,
                    controllerAs: "vm",
                    size: "lg",
                    backdrop: "static",
                    resolve: {
                        data: {
                            id: d.id,
                            personId: callback.personId,
                            encounterId: callback.encounterId
                        }
                    }
                });

                modalInstance.result.then(
                    () => {
                        this.refreshMedication = this.refreshMedication + 1;
                    });
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/pnc-child-visit/pnc-child.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientPncChildVisitLayout", new Component());

}
