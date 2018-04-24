namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        essentialBabyCareId: string;

        static $inject = ["EssentialBabiesCareService", "$state", "$stateParams"];
        constructor(

            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {


            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];
            console.log("params about to save");
            console.log(params);
        }




        saveEssentialBabiesCareExamination = (personInvestigationId: string) => {



            console.log(personInvestigationId);
            console.log(this.essentialBabyCareId);
            this.essentialBabiesCareService.addEssentialBabiesCareInvestigations(this.essentialBabyCareId, personInvestigationId).then((response) => {
                console.log("i have saved response....");
                console.log(response);
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }

        // should go back to tabs


        selectMultiple = (personInvestigationArray: Array<data.IEncounterInvestigation>): void => {


            // loop through array and send id's
            for (let i = 0; i < personInvestigationArray.length; i++) {


                this.saveEssentialBabiesCareExamination(personInvestigationArray[i].personInvestigationId);


            }

            // call my service then close

        }




        select = (personInvestigationId: string, personInvestigationArray: Array<data.IEncounterInvestigation>): void => {


            this.selectMultiple(personInvestigationArray);

            //   this.saveEssentialBabiesCareExamination(personInvestigationId);
            // call my service then close

        }

        /*  select = (personInvestigationId: string) => {
             this.state.go("consultation.management.essentialCareForBabies.investigationslist");
         }
  */
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/investigations/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsEssentialBabiesCarePatientInvestigationSelectLayout", new Component());

}