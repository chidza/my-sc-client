namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonPartogramVitalDialog extends ng.IController {
        closed: () => void;
    }

    class Controller implements IPersonPartogramVitalDialog {

        fetalHeartRateId: string;
        pulseId: string;
        bpId: string;
        temperatureId: string;
        personId: string;
        encounterId: string;
        date: string;
        deliveryId: string;
        quarterHourlyId: string;

        public closed: () => void;

        static $inject = ["$state", "SiteSettingService"];
        constructor(
            private state: ng.ui.IStateService,
            private siteSettingService: data.ISiteSettingService) {
        }

        $onInit = () => {
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID).then((response) => {
                this.fetalHeartRateId = response.value;
                console.log(this.fetalHeartRateId);
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.PULSE_ID).then((response) => {
                this.pulseId = response.value;
                console.log(this.pulseId);
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.TEMPERATURE_ID).then((response) => {
                this.temperatureId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;
            });
        }

        cancel = () => {
            this.closed();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/quarter-hourly-observations/vitals/select-edit.html",
           public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterId: "<",
                personId: "<",
                date: "<",
                deliveryId: "<",
                quarterHourlyId: "<",
                closed: "&"

            };

        }
    }

    app.component("mrsQuarterHourlyVitalSelectEdit", new Component());

}
