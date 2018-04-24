namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounterId: string;
        workspaceId: string;
        essentialBabyCareId: string;

        static $inject = ["EssentialBabiesCareService", "EncounterInvestigationService", "$state", "$stateParams"];
        constructor(
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private encounterInvestigationService: data.IEncounterInvestigationService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService
        ) {


            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.workspaceId = params["workspaceId"];

        }


        add = (): void => {
            console.log("i have been pressed" + this.essentialBabyCareId);
            this.state.go("consultation.management.essentialCareForBabies.investigationsselect", { essentialBabyCareId: this.essentialBabyCareId });
        }

        edit = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.investigationsedit", { essentialBabyCareId: this.essentialBabyCareId, personInvestigationId: id });
        }

        perform = (id: string): void => {
            console.log("this.essentialBabyCareId ====>>> I have clicked ++ ");
            console.log(this.essentialBabyCareId);
            this.state.go("consultation.management.essentialCareForBabies.investigationstests.list", { essentialBabyCareId: this.essentialBabyCareId, personInvestigationId: id });
        }

        send = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.investigationslaboratory", { essentialBabyCareId: this.essentialBabyCareId, personInvestigationId: id });
        }

        delete = (id: string): void => {

            this.encounterInvestigationService.get(id).then((response) => {

                this.essentialBabiesCareService.deleteEssentialBabiesCareInvestigations(this.essentialBabyCareId, response.personInvestigationId).then((res) => {

                    this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

                });



            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/investigations/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                essentialBabyCareId: "<"
            };
        }

    }

    app.component("mrsEssentialBabiesCarePatientInvestigationListLayout", new Component());

}
