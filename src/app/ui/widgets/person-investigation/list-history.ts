namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonInvestigationList extends ng.IController {
        adding: () => void;
        editing: (personInvestigationId: Object) => void;
    }

    class Controller implements IPersonInvestigationList {
        personId: string;
        refresh: number;
        date: string;
        investigationHistory: Array<data.IInvestigationHistoryList> = [];
        public adding: () => void;
        public editing: (personInvestigationId: Object) => void;
        ids: string[] = [];
        investigationResults: data.IResult[] = [];

        static $inject = ["PersonInvestigationService", "InvestigationResultService"];
        constructor(private personInvestigationService: data.IPersonInvestigationService,
            private investigationResultService: data.IInvestigationResultService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {
            if (this.personId && this.date) {
                this.personInvestigationService.getByPersonId(this.personId,  this.date).then((response) => {
                    this.investigationHistory = response;
                    if (this.investigationHistory.length > 0) {
                        this.investigationHistory.forEach((history) => {
                            this.ids.push(history.investigationId);
                        });
                    }

                    if (this.ids.length > 0) {
                        this.investigationResultService.getResultByInvestigationIds(this.ids).then((response) => {
                            this.investigationResults = response;
                        });
                    }
                });
            }
        }

        add = () => {
            this.adding();
        }

        edit = (id: string) => {
            this.editing({ personInvestigationId: id });
        }

        getResult = (id: String): String => {
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
            public templateUrl = "app/ui/widgets/person-investigation/list-history.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editing: "&",
                adding: "&",
                personId: "<",
                refresh: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPersonInvestigationHistoryList", new Component());

}
