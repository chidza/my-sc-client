namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtInvestigationHistoryList extends ng.IController {
        adding: () => void;
        editing: (personInvestigationId: Object) => void;
    }

    class Controller implements IArtInvestigationHistoryList {
        artId: string;
        investigationHistory: Array<data.IArtInvestigationHistoryList> = [];
        public adding: () => void;
        public editing: (personInvestigationId: Object) => void;
        ids: string[] = [];
        investigationResults: data.IResult[] = [];

        static $inject = ["ArtInvestigationHistoryService", "InvestigationResultService", "dialogs"];
        constructor(private artInvestigationHistoryService: data.IArtInvestigationHistoryService,
            private investigationResultService: data.IInvestigationResultService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.artId) {
                this.artInvestigationHistoryService.getByArtId(this.artId).then((response) => {
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

        delete = (item: data.IArtInvestigationHistoryList) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.artInvestigationHistoryService.remove(item.id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-investigation-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editing: "&",
                adding: "&",
                artId: "<"
            };

        }
    }

    app.component("mrsArtInvestigationHistoryList", new Component());

}
