namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPlacentaMembraneDialog extends ng.IController {

    }

    class Controller implements IPlacentaMembraneDialog {

        placentaMembraneId: string;
        placentaMembrane: data.IPlacentaMembrane;
        datePickerOpenStatus = {};

        static $inject = ["PlacentaMembraneService", "DateUtils", "SiteSettingService"];
        constructor(private placentaMembraneService: data.IPlacentaMembraneService
            , private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.placentaMembraneId) {
                this.placentaMembraneService.get(this.placentaMembraneId).then((response) => {
                    this.placentaMembrane = response;
                    if (this.placentaMembrane.date === null) {
                        this.siteSettingService.currentTime().then((response) => {
                            // this.currentTime = response;
                            let ct = response.currentTime;
                            const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                            this.placentaMembrane.date = new Date(myDate);
                            this.placentaMembrane.time = new Date(myDate);
                        });
                    }
                }, (error) => {
                    console.log("muerror");

                });

            }
        }

        openCalendar = (date: any) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }

        update = () => {
            this.placentaMembraneService.update(this.placentaMembrane).then((response) => {
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/placenta-membrane/placenta-membrane.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                placentaMembraneId: "<"
            };

        }
    }

    app.component("mrsPlacentaMembraneDialog", new Component());

}
