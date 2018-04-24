namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        medicationId: string;
        essentialBabyCareId: string;
        date: string;

        static $inject = ["EssentialBabiesCareService", "SiteSettingService", "$state", "$stateParams"];
        constructor(
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private siteSettingService: data.ISiteSettingService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.medicationId = params["medicationId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];
        }



        $onInit = (): void => {
            this.siteSettingService.currentTime().then((response) => {


                this.date = moment(response.currentTime).format("YYYY-MM-DDTHH:mm:00");
            });

        }


        saveEssentialBabiesCareExamination = (medicationId: string) => {

            console.log("medicationId=====>>>>");
            console.log(medicationId);

            this.essentialBabiesCareService.addEssentialBabiesCareExaminations(this.essentialBabyCareId, this.medicationId).then((response) => {
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }

        deleteEssentialBabiesCareExamination = (medicationId: string) => {

            console.log("medicationId=====>>>>");
            console.log(medicationId);

            this.essentialBabiesCareService.deleteEssentialBabiesCareExaminations(this.essentialBabyCareId, this.medicationId).then((response) => {
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }

        close = (id: string, personMedicationId: string): void => {


            this.saveEssentialBabiesCareExamination(personMedicationId);
            // call my service then close

        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/medication/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsEssentialBabiesCarePatientArtMedicineAddLayout", new Component());

}
