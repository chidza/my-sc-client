namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonPartogramVitalDialog extends ng.IController {
    }

    class Controller implements IPersonPartogramVitalDialog {

        fetalHeartRateId: string;
        pulseId: string;
        bpId: string;
        temperatureId: string;
        personId: string;
        encounterId: string;
        date: string;

        static $inject = ["SiteSettingService"];
        constructor(private siteSettingService: data.ISiteSettingService) {
        }

        $onInit = () => {
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID).then((response) => {
                this.fetalHeartRateId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.PULSE_ID).then((response) => {
                this.pulseId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.TEMPERATURE_ID).then((response) => {
                this.temperatureId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/vitals/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterId: "<",
                personId: "<",
                date: "<",
            };

        }
    }

    app.component("mrsPartogramVitalsDialog", new Component());

}
