namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDoctorGeneralExaminationDialog extends ng.IController {

    }

    class Controller implements IDoctorGeneralExaminationDialog {

        doctorGeneralExaminationId: string;
        doctorGeneralExamination: data.IDoctorGeneralExamination;
        vitals: Array<data.IPersonVital> = [];
        vitalIds: Array<string> = [];
        personId: string;
        investigationId: string;
        workspaceId:string;
        encounterId: string;
        levels: Array<data.ILevelOfPresentingPart> = [];
        bp: string = mrs.config.Settings.SiteSettings.BP_ID;
        fetal: string = mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID;
        haemoglobin: string = mrs.config.Settings.SiteSettings.HAEMOGLOBIN_ID;
        static $inject = ["DoctorGeneralExaminationService", "LevelOfPresentingPartService", "SiteSettingService"];
        constructor(private doctorGeneralExaminationService: data.IDoctorGeneralExaminationService,
            private levelOfPresentingPartService: data.ILevelOfPresentingPartService,
            private siteSettingService: data.ISiteSettingService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.doctorGeneralExaminationId) {
                this.doctorGeneralExaminationService.get(this.doctorGeneralExaminationId).then((response) => {
                    this.doctorGeneralExamination = response;
                }, (error) => {
                    console.log(error);
                });
            }

            this.siteSettingService.fetch("INVESTIGATION_HAEMOGLOBIN_ID").then((response) => {
                this.investigationId = response.value;
            });
        }

        $onInit = () => {
            this.levelOfPresentingPartService.query().then((response) => {
                this.levels = response;
            });
        }

        update = () => {
            this.doctorGeneralExaminationService.update(this.doctorGeneralExamination).then((response) => {
                this.doctorGeneralExamination = response;
            }, (error) => {
                console.log(error);
            });
        }
        updateVital = (id: string, vital: string) => {
            if (vital === mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID) {
                this.doctorGeneralExamination.foetalHeartRateId = id;
                this.update();
            }
            if (vital === mrs.config.Settings.SiteSettings.BP_ID) {
                this.doctorGeneralExamination.bloodPressureId = id;
                this.update();
            }

        }

        updateHaemoglobin = (id: string) => {
            this.doctorGeneralExamination.haemoglobinId = id;
            this.update();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/doctor-general-examinations/doctor-general-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                doctorGeneralExaminationId: "<",
                encounterId: "<",
                personId: "<",
                workspaceId: "<"
            };

        }
    }

    app.component("mrsDoctorGeneralExaminationDialog", new Component());

}
