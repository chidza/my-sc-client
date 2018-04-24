namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller {

        updatingHealth = true;

        baseName: string;
        subSystemName: string;
        healthData: any;

        static $inject = ["HealthService", "$uibModal"];
        constructor(private healthService: data.IHealthService,
            private modal: ng.ui.bootstrap.IModalService) {

        }

        $onInit = () => {
            this.baseName = this.healthService.getBaseName();
            this.subSystemName = this.healthService.getSubSystemName();
            this.refresh();
        }

        getLabelClass = (statusState: any) => {
            if (statusState === "UP") {
                return "label-success";
            } else {
                return "label-danger";
            }
        }

        refresh = () => {
            this.updatingHealth = true;
            this.healthService.checkHealth().then((response) => {
                this.healthData = this.healthService.transformHealthData(response);
                this.updatingHealth = false;
            }, (response) => {
                this.healthData = this.healthService.transformHealthData(response.data);
                this.updatingHealth = false;
            });
        }

        showHealth = (health: any) => {
            this.modal.open({
                templateUrl: "app/ui/workspace/admin/health/health.html",
                controller: HealthModalController,
                controllerAs: "vm",
                size: "lg",
                resolve: {
                    currentHealth: () => {
                        return health;
                    },
                    baseName: () => {
                        return this.baseName;
                    },
                    subSystemName: () => {
                        return this.subSystemName;
                    }

                }
            });
        }

    }

    class HealthModalController {

        static $inject = ["$uibModalInstance", "currentHealth", "baseName", "subSystemName"];
        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private currentHealth: any, private baseName: string, private subSystemName: string) { }

        cancel = () => {
            this.$uibModalInstance.dismiss("cancel");
        }

    }

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/admin/health/health.html";
        controller = Controller;
        controllerAs = "vm";
    }

    app.component("mrsHealthLayout", new Component());

}
