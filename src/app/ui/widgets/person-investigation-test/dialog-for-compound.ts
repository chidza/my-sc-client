namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonInvestigationTestDialog extends ng.IController {
        saved: (personInvestigationTestId: Object) => void;
    }

    class Controller implements IPersonInvestigationTestDialog {

        public saved: (personInvestigationTestId: Object) => void;
        personInvestigationTestId: string;
        personInvestigationId: string;
        personInvestigationTest = {} as data.IPersonInvestigationTest;
        personInvestigation = {} as data.IPersonInvestigation;
        investigationResults: Array<data.IResult> = [];
        investigation: data.IInvestigation;
        investigationId: string;
        personId: string;
        date: Date;
        encounterId: string;

        static $inject = ["PersonInvestigationTestService", "PersonInvestigationService", "InvestigationResultService",
            "InvestigationService", "EncounterInvestigationService"];
        constructor(private personInvestigationTestService: data.IPersonInvestigationTestService,
            private personInvestigationService: data.IPersonInvestigationService,
            private investigationResultService: data.IInvestigationResultService,
            private investigationService: data.IInvestigationService,
            private encounterInvestigationService: data.IEncounterInvestigationService) { }

        init = () => {
                this.personInvestigationService.get(this.personInvestigationId).then((response) => {
                    this.personInvestigation = response;
                }, () => {
                    // reset the personInvestigation object
                    this.personInvestigation.id = null;
                    this.personInvestigation.date = this.date;
                    this.personInvestigation.investigationId = this.investigationId;
                    this.personInvestigation.personId = this.personId;
                });

                this.investigationResultService.getResultByInvestigationId(this.investigationId).then((response) => {
                    this.investigationResults = response;
                });
                this.personInvestigationTestService.get(this.personInvestigationTestId).then((response) => {
                    this.personInvestigationTest = response;
                }, (err) => {
                    // reset the personInvesstigationTest object
                    this.personInvestigationTest.date = this.date;
                    this.personInvestigationTest.result = null;
                });
        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        save = () => {
            if (this.personInvestigation.id) {
                this.saveTest();
            } else {
                this.encounterInvestigationService.saveEncounterInvestigation(this.encounterId, this.personInvestigation).then((response) => {
                    this.personInvestigation.id = response.personInvestigationId;
                    this.personInvestigationTest.personInvestigationId = response.personInvestigationId;
                    this.saveTest();
                });
            }


        }

        saveTest = () => {
            if (this.personInvestigationTest.id) {
                this.personInvestigationTestService.update(this.personInvestigationTest).then((response) => {

                    this.updatePersonInvestigation(response.result, response.id);
                });
            }
            else {
                this.personInvestigationTestService.save(this.personInvestigationTest).then((response) => {
                    this.updatePersonInvestigation(response.result, response.id);
                });

            }
        }

        updatePersonInvestigation = (result: string, personInvestigationTestId: string) => {
            this.personInvestigation.resultDate = this.date;
            this.personInvestigation.issueDate = this.date;
            this.personInvestigation.result = result;
            this.personInvestigationService.update(this.personInvestigation).then((response) => {
                this.saved({ personInvestigationId: response.id, personInvestigationTestId: personInvestigationTestId, investigationId: this.investigationId });
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-investigation-test/dialog-for-compound.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                saved: "&",
                personInvestigationTestId: "<",
                personInvestigationId: "<",
                personId: "<",
                investigationId: "<",
                date: "<",
                encounterId: "<"
            };

        }
    }

    app.component("mrsPersonCompoundInvestigationTestDialog", new Component());

}
