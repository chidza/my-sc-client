namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMissingInformationg extends ng.IController {
    }
    export interface IVaginalMonitoringViewCustom {
        time: Date;
        name: string;
    }

    class Controller implements IMissingInformationg {
        start: string;
        end: string;
        deliveryId: string;
        vaginalMonitoring: Array<data.IVaginalMonitoringView> = [];
        vaginalMonitoringMissing: Array<IVaginalMonitoringViewCustom> = [];

        static $inject = ["VaginalMonitoringService"];
        constructor(private vaginalMonitoringService: data.IVaginalMonitoringService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.deliveryId && this.start) {
                this.vaginalMonitoringService.checkMissingRecordings(this.deliveryId, this.start, this.end).then((response) => {
                    this.vaginalMonitoring = response;
                /*   this.vaginalMonitoring.forEach((m) => {
                        if (m.caput === "MISSING") {
                            this.vaginalMonitoringMissing.push({ name: "Caput", time: m.time });
                        }
                        if (m.amniotic === "MISSING") {
                            this.vaginalMonitoringMissing.push({ name: "Amnoitic", time: m.time });
                        }
                        if (m.moulding === "MISSING") {
                            this.vaginalMonitoringMissing.push({ name: "Moulding", time: m.time });
                        }
                    });*/
                });
            }
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/missing-information/amnoitic/missing-amnoitic.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "start": "@",
                "end": "@",
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramMissingAmnoitic", new Component());

}
