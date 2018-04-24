namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ISiteSettingsList extends ng.IController {

    }

    class Controller implements ISiteSettingsList {
        siteSettingId: string;
        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.siteSettingId = params["siteSettingId"];
        }

        onClose = () => {
            this.state.go("administration.site.list");
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/admin/site-setting/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsSiteSettingEditLayout", new Component());

}
