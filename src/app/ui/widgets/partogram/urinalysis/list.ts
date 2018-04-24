namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);
    interface IEncounterInvestigationList extends ng.IController {
    }

    class Controller implements IEncounterInvestigationList {
        personId: string;
        encounterId: string;
        date: string;
        dateFormat: Date;
        urinalysisId: string;
        urinalysis: string = mrs.config.Settings.SiteSettings.COMPOUND_INVESTIGATION_URINALYSIS_ID;

        static $inject = ["SiteSettingService"];
        constructor(private siteSettingService: data.ISiteSettingService) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = (): void => {
            if (this.date) {
                this.dateFormat = new Date(moment(this.date, "YYYY-MM-DDTHH:mm:ss"));
            }

            this.siteSettingService.fetch(this.urinalysis).then((response) => {
                this.urinalysisId = response.value;
            });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/urinalysis/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                encounterId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPartogramUrinalysisList", new Component());

}
