namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

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

        saveEssentialBabiesCareExamination = (personMedicationId: string) => {

            console.log("medicationId=====>>>>");
            console.log(personMedicationId);
            console.log("essentialBabyCareId=====>>>>");
            console.log(this.essentialBabyCareId);

            this.essentialBabiesCareService.addEssentialBabiesCareMedications(this.essentialBabyCareId, personMedicationId).then((response) => {
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }

        close = (id: string, personMedicationId: string) => {
            this.saveEssentialBabiesCareExamination(personMedicationId);
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/medication/add-dispense.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsEssentialBabiesCarePatientConsultMedicineDispenseAddLayout", new Component());

}
