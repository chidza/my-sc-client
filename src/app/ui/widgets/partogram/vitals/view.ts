namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonPartogramVitalView extends ng.IController {
    }

    class Controller implements IPersonPartogramVitalView {

        bp = {} as data.IPersonVital;
        pulse = {} as data.IPersonVital;
        temp = {} as data.IPersonVital;
        fetal = {} as data.IPersonVital;
        bpId: string = mrs.config.Settings.SiteSettings.BP_ID;
        pulseId: string = mrs.config.Settings.SiteSettings.PULSE_ID;
        tempId: string = mrs.config.Settings.SiteSettings.TEMPERATURE_ID;
        fetalId: string = mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID;
        units: Array<data.IUnit> = [];
        vitals: Array<data.IVital> = [];
        personId: string;
        date: string;


        static $inject = ["PersonVitalService", "SiteSettingService", "UnitService", "VitalService"];
        constructor(private personVitalService: data.IPersonVitalService,
            private siteSettingService: data.ISiteSettingService,
            private unitService: data.IUnitService,
            private vitalService: data.IVitalService) {
        }

        $onInit = () => {
            this.unitService.query().then((response) => {
                this.units = response;
            });

            this.vitalService.query().then((response) => {
                this.vitals = response.content;
            });
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.personId && this.date) {
                this.siteSettingService.fetch(this.bpId).then((response) => {
                    this.personVitalService.getByPersonIdVitalIdAndDate(this.personId, response.value, this.date).then((response) => {
                        this.bp = response;
                    });
                });

                this.siteSettingService.fetch(this.pulseId).then((response) => {
                    this.personVitalService.getByPersonIdVitalIdAndDate(this.personId, response.value, this.date).then((response) => {
                        this.pulse = response;
                    });
                });

                this.siteSettingService.fetch(this.fetalId).then((response) => {
                    this.personVitalService.getByPersonIdVitalIdAndDate(this.personId, response.value, this.date).then((response) => {
                        this.fetal = response;
                    });
                });

                this.siteSettingService.fetch(this.bpId).then((response) => {
                    this.personVitalService.getByPersonIdVitalIdAndDate(this.personId, response.value, this.date).then((response) => {
                        this.bp = response;
                    });
                });

                this.siteSettingService.fetch(this.tempId).then((response) => {
                    this.personVitalService.getByPersonIdVitalIdAndDate(this.personId, response.value, this.date).then((response) => {
                        this.temp = response;
                    });
                });
            }

        }

        getUnit = (vitalId: string): string => {
            let result: string = "";
            if (this.vitals) {
                this.vitals.forEach((v) => {
                    if (v.id === vitalId) {
                        this.units.forEach((u) => {
                            if (u.id === v.unitId) {
                                result = u.name;
                            }
                        });
                    }
                });
            }
            return result;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/vitals/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                date: "<",
            };

        }
    }

    app.component("mrsPartogramVitalView", new Component());

}
