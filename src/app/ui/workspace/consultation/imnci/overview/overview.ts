namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        encounterId: string;
        imnciVisit = {} as data.IImnciVisit;

        static $inject = ["$stateParams", "ImnciVisitService", "SiteSettingService"];
        constructor(params: ng.ui.IStateParamsService,
            private imnciVisitService: data.IImnciVisitService,
            private siteSettingService: data.ISiteSettingService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }

        

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciOverviewLayout", new Component());

}
