namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterInvestigationSendToLabDialog extends ng.IController {
        closed: () => void;
        saved: () => void;
    }

    class Controller implements IEncounterInvestigationSendToLabDialog {
        public closed: () => void;
        public saved: () => void;
        labs: Array<data.ILab> = [];
        personInvestigationId: string;
        personInvestigation = {} as data.IPersonInvestigation;
        sample: data.ISample;
        labTest: data.ILabTest;

        static $inject = ["LabService", "PersonInvestigationService", "InvestigationService", "SampleService", "LabTestService"];
        constructor(private labService: data.ILabService,
            private personInvestigationService: data.IPersonInvestigationService,
            private investigationService: data.IInvestigationService,
            private sampleService: data.ISampleService,
            private labTestService: data.ILabTestService) { }

        $onInit = () => {
            this.labService.query().then((response) => {
                this.labs = response;
            });
            this.personInvestigationService.get(this.personInvestigationId).then((response) => {
                this.personInvestigation = response;
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
            this.saved();
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/essential-care-for-babies-investigation/send-to-lab.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                saved: "&",
                closed: "&",
                personInvestigationId: "<"
            };

        }
    }

    app.component("mrsEssentialCareBabiesInvestigationSendToLabDialog", new Component());

}
