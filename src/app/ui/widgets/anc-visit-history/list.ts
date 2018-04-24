namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncVisitList extends ng.IController {
        editVisit: (visitId: Object) => void;
        addVisit: () => void;
    }

    class Controller implements IAncVisitList {
        public editVisit: (visitId: Object) => void;
        public addVisit: () => void;
        ancId: string;
        ancVisits: Array<data.IAncVisitList> = [];
        investigationResults: Array<data.IResult> = [];

        static $inject = ["AncVisitService", "InvestigationResultService", "dialogs", "SiteSettingService"];
        constructor(private ancVisitService: data.IAncVisitService,
            private investigationResultService: data.IInvestigationResultService,
            private dialog: ng.dialogservice.IDialogService,
            private siteSettingService: data.ISiteSettingService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {
            if (this.ancId) {
                this.ancVisitService.ancVisits(this.ancId).then((response) => {
                    this.ancVisits = response;
                });
                this.siteSettingService.fetch("INVESTIGATION_MALARIA_ID").then((response) => {
                    this.investigationResultService.getResultByInvestigationId(response.value).then((response) => {
                        this.investigationResults = response;
                    });
                });

            }
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

        edit = (item: data.IAncVisit) => {
            this.editVisit({ visitId: item.id });
        }

        remove = (item: data.IAncVisit) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.ancVisitService.remove(item.id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addVisit();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc-visit-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                addVisit: "&",
                editVisit: "&",
                ancId: "<"
            };

        }
    }

    app.component("mrsAncVisitList", new Component());

}
