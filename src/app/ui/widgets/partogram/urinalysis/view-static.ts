namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);
    interface IEncounterInvestigationList extends ng.IController {
    }

    class Controller implements IEncounterInvestigationList {
        personId: string;
        date: string;
        encounterInvestigations: Array<data.IEncounterInvestigationList> = [];
        partogramInvestigations: Array<data.IPartogramInvestigation> = [];
        investigationResults: Array<data.IResult> = [];
        ids: string[] = [];


        static $inject = ["EncounterInvestigationService", "dialogs", "PersonInvestigationService", "$uibModal", "InvestigationResultService"];
        constructor(private encounterInvestigationService: data.IEncounterInvestigationService,
            private dialog: ng.dialogservice.IDialogService,
            private personInvestigationService: data.IPersonInvestigationService,
            private modal: ng.ui.bootstrap.IModalService,
            private investigationResultService: data.IInvestigationResultService) {

        }

        init = () => {
            if (this.personId && this.date) {
                this.personInvestigationService.getByPartogramInvestigations(this.personId, this.date).then((response) => {
                    this.partogramInvestigations = response;
                    this.partogramInvestigations.forEach((response) => {
                        this.ids.push(response.investigationId);
                    });

                    this.investigationResultService.getResultByInvestigationIds(this.ids).then((response) => {
                        this.investigationResults = response;
                    });
                });
            }

        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        getResult = (id: string): String => {
            let result: String = id;
            if (this.investigationResults.length > 0) {
                this.investigationResults.forEach((r) => {
                    if (r.id === id) {
                        result = r.name;
                    }
                });
            }

            return result;
        }
    }
    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/urinalysis/view-static.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsUrinalysisViewStatic", new Component());

}
