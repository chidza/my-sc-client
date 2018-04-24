namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtInvestigationHistoryList extends ng.IController {
        adding: () => void;
        selected: (personInvestigationId: Object) => void;
    }

    class Controller implements IArtInvestigationHistoryList {
        personId: string;
        personInvestigations: Array<data.IInvestigationHistoryList> = [];
        public adding: () => void;
        public selected: (personInvestigationId: Object) => void;
        ids: string[] = [];
        hivInvestigationId: string;
        investigationResults: Array<data.IResult> = [];

        static $inject = ["PersonInvestigationService", "SiteSettingService", "InvestigationResultService"];
        constructor(private personInvestigationService: data.IPersonInvestigationService,
            private siteSettingService: data.ISiteSettingService,
            private investigationResultService: data.IInvestigationResultService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        $onInit = () => {
            this.siteSettingService.fetch("INVESTIGATION_HIV_TEST_ID").then((response) => {
                this.hivInvestigationId = response.value;
                this.investigationResultService.getResultByInvestigationId(this.hivInvestigationId).then((response) => {
                    this.investigationResults = response;

                });
            });
        }

        init = () => {
            if (this.personId) {
                this.personInvestigationService.getByPersonId(this.personId).then((response) => {
                    if (response.length > 0) {
                        response.forEach((i) => {
                            if (i.investigationId === this.hivInvestigationId) {
                                this.personInvestigations.push(i);
                            }
                        });
                    }
                });
            }
        }

        getResult = (id: String): String => {
            let result: String;
            if (this.investigationResults.length > 0) {
                this.investigationResults.forEach((r) => {
                    if (r.id === id) {
                        result = r.name;
                    }
                });
            } else {
                result = id;
            }

            return result;
        }

        use = (id: string) => {
            this.selected({ personInvestigationId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-investigation-history/hiv-test-list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsArtInvestigationHivTestList", new Component());

}
