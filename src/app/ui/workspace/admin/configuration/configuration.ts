namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller {

        allConfiguration: Array<any> = [];
        configuration: Array<any> = [];

        static $inject = ["$filter", "ConfigurationService"];
        constructor(filter: ng.IFilterService, private configurationService: data.IConfigurationService) {

        }

        $onInit = () => {
            this.configurationService.get().then((response) => {
                this.configuration = response;
            });

            this.configurationService.getEnv().then((response) => {
                this.allConfiguration = response;
            });
        }

    }

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/admin/configuration/configuration.html";
        controller = Controller;
        controllerAs = "vm";
    }

    app.component("mrsConfigurationLayout", new Component());

}
