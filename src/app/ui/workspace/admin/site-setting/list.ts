namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ISiteSettingsList extends ng.IController {

    }

    class Controller implements ISiteSettingsList {



        static $inject = ["$state", "$stateParams", "ReportService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private reportService: data.IReportService) {
        }

        edit = (id: string) => {
            this.state.go("administration.site.edit", { siteSettingId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/admin/site-setting/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsSiteSettingListLayout", new Component());

}
