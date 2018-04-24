namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        investigationId: string;
        encounterId: string;
        essentialBabyCareId: string;

        static $inject = ["EssentialBabiesCareService", "$state", "$stateParams"];
        constructor(
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.investigationId = params["investigationId"];
            this.encounterId = params["encounterId"];

        }

      /*   saveEssentialBabiesCareInvestigation = (personInvestigationId: string) => {
            console.log("personInvestigationId ======>>>>>");
            console.log(personInvestigationId);
            console.log("saving investigatoin ku essential babies now....");
            this.essentialBabiesCareService.addEssentialBabiesCareInvestigations(this.essentialBabyCareId, personInvestigationId).then((response) => {
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }
 */
        // should go back to tabs
        close = (): void => {

            this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });
         //   this.saveEssentialBabiesCareInvestigation(personInvestigationId);
            // call my service then close

        }


         /* close = (personInvestigationId: string): void => {
             this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });
         } */


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/investigations/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsEssentialBabiesCarePatientInvestigationAddLayout", new Component());

}
