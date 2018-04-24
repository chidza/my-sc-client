namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterInvestigationSendToLabDialog extends ng.IController {
        closed: () => void;
        saved: (id: Object) => void;
    }

    class Controller implements IEncounterInvestigationSendToLabDialog {
        public closed: () => void;
        public saved: (id: Object) => void;
        labs: Array<data.ILab> = [];
        personInvestigationId: string;
        personInvestigation = {} as data.IPersonInvestigation;
        sample: data.ISample;
        labTest: data.ILabTest;
        labInvestigation = {} as data.ILabInvestigation;
        labInvestigationId: string;
        labLocation: string;
        labId: string;
        labLocations: Array<string> = ["LOCAL", "EXTERNAL"];

        static $inject = ["LabService", "PersonInvestigationService", "InvestigationService", "SampleService", "LabTestService", "LabInvestigationService"];
        constructor(private labService: data.ILabService,
            private personInvestigationService: data.IPersonInvestigationService,
            private investigationService: data.IInvestigationService,
            private sampleService: data.ISampleService,
            private labTestService: data.ILabTestService,
            private labInvestigationService: data.ILabInvestigationService) { }

        $onInit = () => {
            this.labService.query().then((response) => {
                this.labs = response;
            });
            this.personInvestigationService.get(this.personInvestigationId).then((response) => {
                this.personInvestigation = response;

                this.labInvestigation.dateSampleTaken = this.personInvestigation.date;
                this.labInvestigation.personInvestigationId = this.personInvestigation.id;

                console.log("this.labInvestigation");
                console.log(this.labInvestigation);
                this.investigationService.get(response.investigationId).then((response) => {
                    this.sampleService.get(response.sampleId).then((response) => {
                        this.sample = response;
                    });
                    this.labTestService.get(response.testId).then((response) => {
                        this.labTest = response;
                    });
                });




            });


        }

        save = () => {
            this.labInvestigation.labLocation = this.labLocation;
            this.labInvestigation.laboratoryId = this.labId;
            console.log("in savig .labInvestigation");
            console.log(this.labInvestigation);

            /*   this.labInvestigationService.save(this.labInvestigation).then((response) => {
                  console.log(":response");
                  console.log(response);
              }); */
            if (this.labInvestigation.id !== "") {
                this.labInvestigationService.update(this.labInvestigation).then((response) => {
                    this.saved({ labInvestigationId: response.id });
                });
            }
            else {
                this.onSave(this.labInvestigationService.save(this.labInvestigation));

            }
        }

        onSave = (promise: ng.IPromise<data.ILabInvestigation>) => {
            promise.then((response) => {
                this.saved({ labInvestigationId: response.id });

            }, () => {
                console.log("save error");
            });
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/encounter-investigation/send-to-lab.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                saved: "&",
                closed: "&",
                personInvestigationId: "<"
            };

        }
    }

    app.component("mrsEncounterInvestigationSendToLabDialog", new Component());

}
