namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtExaminationDialog extends ng.IController {
        setHiv: (hiv: Object) => void;
    }

    class Controller implements IArtExaminationDialog {
        public setHiv: (hiv: Object) => void;

        datePickerOpenStatus = {};
        now: Date = new Date();
        art: data.IArt;
        artId: string;
        personInvestigation: data.IPersonInvestigation;        
        normality: string[] = ["NORMAL", "ABNORMAL"];        
        investigationId: string;
        encounterId: string;
        personId: string;
        weight: string = mrs.config.Settings.SiteSettings.WEIGHT_ID;
        height: string = mrs.config.Settings.SiteSettings.HEIGHT_ID;
        temp: string = mrs.config.Settings.SiteSettings.TEMPERATURE_ID;
        bp: string = mrs.config.Settings.SiteSettings.BP_ID;
        rr: string = mrs.config.Settings.SiteSettings.RR_ID;
        pulse: string = mrs.config.Settings.SiteSettings.PULSE_ID;
        workspaceId: string;

        static $inject = ["ArtService", "PersonInvestigationService", "PersonVitalService", "SiteSettingService"];
        constructor(private artService: data.IArtService,
            private personInvestigationService: data.IPersonInvestigationService,
            private personVitalService: data.IPersonVitalService,
            private siteSettingService: data.ISiteSettingService) {

        }

        $onInit = (): void => {

            this.siteSettingService.fetch("INVESTIGATION_HIV_TEST_ID").then((response) => {
                this.investigationId = response.value;
            });

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            if (this.artId) {
                this.artService.get(this.artId).then((response) => {
                    this.art = response;
                    this.personId = response.personId;

                    if (response.investigationId) {
                        this.personInvestigationService.get(response.investigationId).then((response) => {
                            this.personInvestigation = response;
                        });
                    }

                });
            }

        }

        openCalendar = (date: string) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }

        }

        hiv = () => {
            if (this.personInvestigation) {
                this.setHiv({ personInvestigationId: this.personInvestigation.id, investigationId: this.investigationId });
            } else {
                this.setHiv({ personInvestigationId: "", investigationId: this.investigationId });
            }
        }

        updateVital = (personVitalId: string, vitalType: string) => {
            if (vitalType === mrs.config.Settings.SiteSettings.RR_ID) {
                this.art.rrId = personVitalId;
                this.update();
            }
            if (vitalType === mrs.config.Settings.SiteSettings.HEIGHT_ID) {
                this.art.heightId = personVitalId;
                this.update();
            }
            if (vitalType === mrs.config.Settings.SiteSettings.PULSE_ID) {
                this.art.pulseId = personVitalId;
                this.update();
            }
            if (vitalType === mrs.config.Settings.SiteSettings.BP_ID) {
                this.art.bpId = personVitalId;
                this.update();
            }
            if (vitalType === mrs.config.Settings.SiteSettings.TEMPERATURE_ID) {
                this.art.temperatureId = personVitalId;
                this.update();
            }
            if (vitalType === mrs.config.Settings.SiteSettings.WEIGHT_ID) {
                this.art.weightId = personVitalId;
                this.update();
            }
        }

        update = () => {
            this.artService.update(this.art).then((response) => {
                this.art = response;
            });
        }

        generateArtNumber = () => {
            this.artService.generate().then((response) => {
                this.art.artNumber = response.number;
                this.update();
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-examination/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                artId: "<",
                setHiv: "&",
                encounterId: "<",
                workspaceId: "<"
            };

        }
    }

    app.component("mrsArtExaminationDialog", new Component());

}
