
namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncOverviewScreening extends ng.IController {

    }

    class Controller implements IPncOverviewScreening {

        personId: string;
        pncVisitId: string;
        encounterId: string;
        cervicalCancerScreening = {} as data.IScreeningStatus;
        breastCancerScreening = {} as data.IScreeningStatus;
        syphilis = {} as data.IPersonInvestigation;
        syphilisId: string = mrs.config.Settings.SiteSettings.INVESTIGATION_SYPHILIS_ID;
        syphilisResult: string;
        investigationResults: Array<data.IResult> = [];

        static $inject = ["PncVisitService", "PersonProcedureService", "PersonInvestigationService",
            "SiteSettingService", "InvestigationResultService"];
        constructor(private pncVisitService: data.IPncVisitService,
            private personProcedureService: data.IPersonProcedureService,
            private personInvestigationService: data.IPersonInvestigationService,
            private siteSettingService: data.ISiteSettingService,
            private investigationResultService: data.IInvestigationResultService) {

        }

        init = () => {
            this.personProcedureService.cervicalCancerScreening(this.personId).then((response) => {
                this.cervicalCancerScreening = response;
            });

            this.personProcedureService.breastCancerScreening(this.personId).then((response) => {
                this.breastCancerScreening = response;
            });

            this.siteSettingService.fetch(this.syphilisId).then((response) => {
                this.personInvestigationService.getCurrentByPersonIdAndInvestigationId(this.personId, response.value).then((response) => {
                    this.syphilis = response;
                    if (this.syphilis.result != null) {
                        this.investigationResultService.getResultByInvestigationId(this.syphilis.investigationId).then((response) => {
                            this.investigationResults = response;
                        });
                    }
                });
            });

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.personId) {
                this.init();
            }
        }

        getResult = (): string => {
            let result: string = "Done but no result";

            if (this.syphilis.id) {
                this.investigationResults.forEach((r) => {
                    if (r.id === this.syphilis.result) {
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
            public templateUrl = "app/ui/widgets/pnc-overview-questionaire/screening.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                pncVisitId: "<",
                encounterId: "<"
            };

        }
    }

    app.component("mrsPncOverviewScreening", new Component());

}
