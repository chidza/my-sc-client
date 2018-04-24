namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParamsService extends ng.ui.IStateParamsService {
        personId: string;
        examinationId: string;
        encounterId: string;
        examinationEcbId: string;
        workspaceId: string;
        essentialBabyCareId: string;

    }

    class Controller implements ng.IController {

        personId: string;
        examinationId: string;
        encounterId: string;
        examinationEcbId: string;
        workspaceId: string;
        date: string;
        essentialBabyCareId: string;

        static $inject = ["EssentialBabiesCareService", "SiteSettingService", "$state", "$stateParams"];
        constructor(

            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private siteSettingService: data.ISiteSettingService,
            private state: ng.ui.IStateService,
            private params: IStateParamsService) {
            this.personId = params.personId;
            this.examinationId = params.examinationId;
            this.encounterId = params.encounterId;
            this.examinationEcbId = params.examinationEcbId;
            this.workspaceId = params.workspaceId;
            this.essentialBabyCareId = params.essentialBabyCareId;


        }

        $onInit = (): void => {
            this.siteSettingService.currentTime().then((response) => {


                this.date = moment(response.currentTime).format("YYYY-MM-DDTHH:mm:00");
            });

        }

        saveEssentialBabiesCareExamination = (personExaminationId: string) => {

            this.essentialBabiesCareService.addEssentialBabiesCareExaminations(this.essentialBabyCareId, personExaminationId).then((response) => {
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }

        // should go back to tabs
        close = (id: string, personExaminationId: string): void => {


            this.saveEssentialBabiesCareExamination(personExaminationId);
            // call my service then close

        }


    }

    class Component implements ng.IComponentOptions {




        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/examination/add-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientEssentialCareForBabiesAddExaminationLayout", new Component());

}
