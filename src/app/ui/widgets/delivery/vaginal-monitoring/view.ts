namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVaginalMonitoringView extends ng.IController {
    }

    class Controller implements IVaginalMonitoringView {

        deliveryId: string;
        start: string;
        end: string;
        width: number;
        record: Array<data.IVaginalMonitoringView> = [];

        static $inject = ["VaginalMonitoringService"];
        constructor(private vaginalMonitoringService: data.IVaginalMonitoringService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId && this.start) {
                this.vaginalMonitoringService.getForPartogram(this.deliveryId, this.start, this.end).then((response) => {
                    this.record = response;
                });
            }

        }

    }
    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/vaginal-monitoring/view.html",

            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                start: "<",
                end: "<",
                width: "<"
            };

        }
    }

    app.component("mrsVaginalMonitoringView", new Component());

}
