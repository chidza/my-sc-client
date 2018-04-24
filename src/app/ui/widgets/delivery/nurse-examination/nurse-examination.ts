namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface INurseExaminationDialog extends ng.IController {


    }

    class Controller implements INurseExaminationDialog {


        nurseGeneralExaminationId: string;
        personInvestigation: data.IPersonInvestigation;
        nurseGeneralExamination: data.INurseGeneralExamination;
        investigationId: string;
        vitals: Array<data.IPersonVital> = [];
        vitalIds: Array<string> = [];
        levels: Array<data.ILevelOfPresentingPart> = [];
        personId: string;
        workspaceId: string;
        encounterId: string;
        bp: string = mrs.config.Settings.SiteSettings.BP_ID;
        fetal: string = mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID;
        temp: string = mrs.config.Settings.SiteSettings.TEMPERATURE_ID;
        pulse: string = mrs.config.Settings.SiteSettings.PULSE_ID;
        haemoglobin: string = mrs.config.Settings.SiteSettings.HAEMOGLOBIN_ID;

        static $inject = ["NurseGeneralExaminationService", "PersonVitalService", "PersonInvestigationService", "LevelOfPresentingPartService", "SiteSettingService"];
        constructor(private nurseGeneralExaminationService: data.INurseGeneralExaminationService,
            private personVitalService: data.IPersonVitalService,
            private personInvestigationService: data.IPersonInvestigationService,
            private levelOfPresentingPartService: data.ILevelOfPresentingPartService,
            private siteSettingService: data.ISiteSettingService) {


        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();

            console.log("trace 1", this.workspaceId);
        }

        init = () => {
            if (this.nurseGeneralExaminationId) {
                this.nurseGeneralExaminationService.get(this.nurseGeneralExaminationId).then((response) => {
                    this.nurseGeneralExamination = response;
                }, (error) => {
                    console.log(error);
                });
            }
            this.siteSettingService.fetch("INVESTIGATION_HAEMOGLOBIN_ID").then((response) => {
                this.investigationId = response.value;
            });
            this.levelOfPresentingPartService.query().then((response) => {
                this.levels = response;
            });
        }

        updateVital = (id: string, vital: string) => {
            if (vital === mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID) {
                this.nurseGeneralExamination.foetalHeartRateId = id;
                this.update();
            }
            if (vital === mrs.config.Settings.SiteSettings.BP_ID) {
                this.nurseGeneralExamination.bloodPressureId = id;
                this.update();
            }

            if (vital === mrs.config.Settings.SiteSettings.TEMPERATURE_ID) {
                this.nurseGeneralExamination.temperatureId = id;
                this.update();
            }

            if (vital === mrs.config.Settings.SiteSettings.PULSE_ID) {
                this.nurseGeneralExamination.pulseId = id;
                this.update();
            }

        }
        update = () => {
            this.nurseGeneralExaminationService.update(this.nurseGeneralExamination).then((response) => {
                this.nurseGeneralExamination = response;
            }, (error) => {
                console.log(error);
            });
        }


        updateHaemoglobin = (id: string) => {
            this.nurseGeneralExamination.haemoglobinId = id;
            this.update();
        }




    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/nurse-examination/nurse-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                nurseGeneralExaminationId: "<",
                encounterId: "<",
                personId: "<",
                workspaceId: "<"

            };

        }
    }

    app.component("mrsNurseExaminationDialog", new Component());

}
