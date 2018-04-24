namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        loggers: Array<data.ILogger> = [];

        static $inject = ["LogsService"];
        constructor(private logsService: data.ILogsService) {

        }

        $onInit = () => {
            this.loggers = this.logsService.findAll();
        }

        changeLevel = (name: string, level: string): void => {
            this.logsService.changeLevel({ name: name, level: level }, () => {
                this.loggers = this.logsService.findAll();
            });
        }
    }

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/admin/logs/logs.html";
        controller = Controller;
        controllerAs = "vm";
    }

    app.component("mrsLogger", new Component());

}