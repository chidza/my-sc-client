namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonCompoundInvestigationDialog extends ng.IController {

    }

    class Controller implements IPersonCompoundInvestigationDialog {
        encounterId: string;
        compoundInvestigationId: string;
        date: string;
        personId: string;
        compoundInvestigation = {} as data.ICompoundInvestigation;
        personInvestigations: Array<data.IPersonCompoundInvestigation> = [];


        static $inject = ["DateUtils", "CompoundInvestigationService", "PersonCompoundInvestigationService", "PersonInvestigationService", "PersonInvestigationTestService"];
        constructor(private DateUtils: utils.IDateUtils, private compoundInvestigationService: data.ICompoundInvestigationService,
            private personCompoundInvestigationService: data.IPersonCompoundInvestigationService,
            private personInvestigationService: data.IPersonInvestigationService,
            private personInvestigationTestService: data.IPersonInvestigationTestService) { }

        init = () => {
            if (this.compoundInvestigationId && this.date && this.personId) {
                this.compoundInvestigationService.get(this.compoundInvestigationId).then((response) => {
                    this.compoundInvestigation = response;
                });
                this.date = this.DateUtils.convertLocalDateTimeToServer(new Date(moment(this.date, "YYYY-MM-DDTHH:mm:ss")));
                this.personCompoundInvestigationService.getPersonCompoundInvestigations(this.compoundInvestigationId, this.personId, this.date).then((response) => {
                    this.personInvestigations = response;
                });
            }
        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        onTestSaved = (personInvestigationId: string, personInvestigationTestId: string, investigationId: string) => {
            this.personInvestigations.forEach((row) => {
                if (row.investigationId === investigationId) {
                    row.personInvestigationId = personInvestigationId;
                    row.personInvestigationTestId = personInvestigationTestId;
                }
            });
        }

        delete = (model: data.IPersonCompoundInvestigation) => {
            this.personInvestigationTestService.remove(model.personInvestigationTestId).then((response) => {
                this.personInvestigations.forEach((row) => {
                    if (row.investigationId === model.investigationId) {
                        row.personInvestigationId = "";
                        row.personInvestigationTestId = "";
                    }
                });
            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/compound-investigation/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                compoundInvestigationId: "<",
                personId: "<",
                date: "<",
                encounterId: "<"
            };

        }
    }

    app.component("mrsPersonCompoundInvestigationDialog", new Component());

}
