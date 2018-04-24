namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        queueId: string;
        ancId: string;
        personId: string;
        workareaId: string;
        ancObstetricExaminationId: string;
        ancGeneralAssessmentId: string;
        date: string;
        ancVisit: data.IAncVisit;
        visitId: string;
        encounterId: string;
        refreshVital: number = 1;
        refreshMedication: number = 1;
        refreshInvestigation: number = 1;
        refreshHealthEducation: number = 1;

        static $inject = ["$state", "$stateParams", "AncVisitService", "EncounterService", "$uibModal", "PersonVitalService", "PersonMedicationService", "PersonInvestigationService", "PersonHealthEducationService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancVisitService: data.IAncVisitService,
            private encounterService: data.IEncounterService,
            private modal: ng.ui.bootstrap.IModalService,
            private personVitalService: data.IPersonVitalService,
            private personMedicationService: data.IPersonMedicationService,
            private personInvestigationService: data.IPersonInvestigationService,
            private personHealthEducationService: data.IPersonHealthEducationService) {
            this.queueId = params["workareaId"];
            this.ancId = params["ancId"];
            this.personId = params["personId"];
            this.workareaId = params["workareaId"];
            this.visitId = params["visitId"];
            this.encounterId = params["encounterId"];
        }
        $onInit = (): void => {
            console.log(" pano pano pano pamno ");
            console.log(this);
            this.ancVisitService.get(this.visitId).then((response) => {
                this.ancVisit = response;
                this.ancObstetricExaminationId = response.obstetricExaminationId;
                this.ancGeneralAssessmentId = response.generalAssessmentId;
                // this.encounterId = response.encounterId;
                this.encounterService.get(this.ancVisit.encounterId).then((response) => {
                    this.date = moment(response.date).format("YYYY-MM-DDTHH:mm:ss");
                });
            }, (error) => {
            });


        }
        onClose = () => {
            if (this.ancId) {
                this.state.go("consultation.management.ancregistration.visitHistory.list", { ancId: this.ancId });
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

        addVital = () => {
            let header = "Vital Signs List";

            let body = `<mrs-encounter-vital-select select-vital="vm.select(id)">
            </mrs-encounter-vital-select>`;

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
                    this.createVital(id);
                });
        }

        createVital = (id: string) => {

            let callback = this;


            let header = "Vital Addss";

            let body = `<mrs-person-vital-dialog person-vital-id=" " person-id="vm.data.personId" 
            vital-id="vm.data.id" date="vm.data.date" saved = "vm.close()" closed = "vm.close()"></mrs-person-vital-dialog>`;

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
                        date: callback.date
                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.refreshVital = this.refreshVital + 1;
                });
        }

        editVital = (id: string) => {
            this.personVitalService.get(id).then((response) => {
                let header = "Vital Edit";

                let body = `<mrs-person-vital-dialog person-vital-id = "` + id + `" person-id = "` + this.personId + `" 
            vital-id = "` + response.vitalId + `" saved = "vm.close()" closed = "vm.close()"></mrs-person-vital-dialog>`;

                let footer = "";

                let template: string = this.modelTemplate(header, body, footer);

                let modalInstance = this.modal.open({
                    controller: function () {
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
                        this.refreshVital = this.refreshVital + 1;
                    });
            });

        }

        selectInvestigation = () => {
            let header = "Investigations List";

            let body = `<mrs-investigation-select select-investigation="vm.select(id)"></mrs-investigation-select>`;

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
                    this.addInvestigation(id);
                });
        }

        addInvestigation = (id: string) => {

            let callback = this;

            let header = "Investigation Add";
            let body = `<mrs-person-investigation-dialog closed="vm.close()" 
            saved="vm.close()" person-id="vm.data.personId" date="vm.data.date"
            investigation-id="vm.data.id"
        person-investigation-id=" "></mrs-person-investigation-dialog>`;

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
                        date: callback.date

                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.refreshInvestigation = this.refreshInvestigation + 1;
                });
        }

        editInvestigation = (id: string) => {

            let callback = this;

            let d: data.IPersonInvestigation;

            this.personInvestigationService.get(id).then((response) => {
                d = response;

                let header = "Investigation Edit";
                let body = `<mrs-person-investigation-dialog closed="vm.close()" 
            saved="vm.close()" person-id="vm.data.personId" investigation-id="vm.data.investigationId"
        person-investigation-id="vm.data.id"></mrs-person-investigation-dialog>`;

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
                            investigationId: d.investigationId

                        }
                    }
                });

                modalInstance.result.then(
                    () => {
                        this.refreshInvestigation = this.refreshInvestigation + 1;
                    });
            });

        }

        selectMedication = () => {
            let header = "Medications List";

            let body = `<mrs-medication-select select-medication="vm.select(medicationId)">
            </mrs-medication-select>`;

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
            let body = `<mrs-person-medication-dialog person-id="vm.data.personId" drug-name-id="vm.data.id" 
            person-medication-id="-1" saved="vm.close()" date="vm.data.date"
            closed="vm.close() "></mrs-person-medication-dialog>`;

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
                        date: callback.date

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
            let d: data.IPersonMedication;


            this.personMedicationService.get(id).then((response) => {
                d = response;

                let header = "Medication Edit";
                let body = `<mrs-person-medication-dialog person-id="vm.data.personId" drug-name-id="vm.data.drugNameId" 
            person-medication-id="vm.data.id" saved="vm.close()"
            closed="vm.close() "></mrs-person-medication-dialog>`;

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
                            drugNameId: d.drugNameId

                        }
                    }
                });

                modalInstance.result.then(
                    () => {
                        this.refreshMedication = this.refreshMedication + 1;
                    });
            });
        }

        selectHealthEducation = () => {
            let header = "Health Education List";

            let body = ` <mrs-health-education-topic-select select-health-education-topic="vm.select(healthEducationTopicId)"></mrs-health-education-topic-select>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: function () {
                    this.select = function (healthEducationTopicId: string) {
                        modalInstance.dismiss(healthEducationTopicId);
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
                (healthEducationTopicId) => {
                    this.addHealthEducation(healthEducationTopicId);
                });
        }

        editHealthEducation = (id: string) => {
            let callback = this;
            let d: data.IPersonHealthEducation;
            this.personHealthEducationService.get(id).then((response) => {
                d = response;
                let header = "Health Education Edit";
                let body = `<mrs-person-health-education-dialog closed="vm.close()" 
            saved="vm.close()" person-id="vm.data.personId" health-education-topic-id="vm.data.healthEducationTopicId"
        person-health-education-id="vm.data.id"></mrs-person-health-education-dialog>`;

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
                            healthEducationTopicId: d.healthEducationTopicId
                        }
                    }
                });

                modalInstance.result.then(
                    () => {
                        this.refreshHealthEducation = this.refreshHealthEducation + 1;
                    });
            });

        }

        addHealthEducation = (id: string) => {
            let callback = this;
            let header = "Health Education Add";
            let body = `<mrs-person-health-education-dialog person-id="vm.data.personId" health-education-topic-id="vm.data.id" 
            date="vm.data.date" person-health-education-id="-1" saved="vm.close()" 
            closed="vm.close() "></mrs-person-health-education-dialog>`;

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

                    }
                }
            });

            modalInstance.result.then(
                () => {
                    this.refreshHealthEducation = this.refreshHealthEducation + 1;
                });
        }



    }

    class Component implements ng.IComponentOptions {


        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/visit-history/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
        }
    }

    app.component("mrsConsultationPatientAncVisitHistoryEditLayout", new Component());

}
