namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        imnciVisitId: string;
        categoryId: string;

        static $inject = ["$stateParams", "SiteSettingService"];
        constructor(params: ng.ui.IStateParamsService,
            private siteSettingService: data.ISiteSettingService) {
            this.imnciVisitId = params["imnciVisitId"];
            this.personId = params["personId"];
        }

        $onInit = () => {
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.DIARRHOEA_CATEGORY_ID).then((response) => {
                this.categoryId = response.value;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/visit/diarrhoea/diarrhoea.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciVisitDiarrhoeaLayout", new Component());

}
