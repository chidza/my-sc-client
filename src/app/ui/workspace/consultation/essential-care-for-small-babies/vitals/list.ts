namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workspaceId: string;
        encounterId: string;
        essentialBabyCareId: string;

        static $inject = ["EncounterExaminationService", "EssentialBabiesCareService", "$state", "$stateParams"];
        constructor(

            private encounterVitalService: data.IEncounterVitalService,
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
            this.encounterId = params["encounterId"];
            console.log("params....", this.encounterId);
        }


        add = (): void => {
            console.log("now kushell...");
            this.state.go("consultation.management.essentialCareForBabies.vitalsselect", { essentialBabyCareId: this.essentialBabyCareId });
        }


        edit = (id: string): void => {
            this.state.go("consultation.management.essentialCareForBabies.vitalsedit", { essentialBabyCareId: this.essentialBabyCareId, encounterVitalId: id });
        }

        deleteVital = (id: string): void => {
            console.log("deleting.....");
            console.log(id);

            console.log("deleting.....");
            console.log(this.essentialBabyCareId);

            this.essentialBabiesCareService.deleteEssentialBabiesCareVitals(this.essentialBabyCareId, id).then((response) => {

                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });





            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/vitals/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                essentialBabyCareId: "<"
            };
        }

    }

    app.component("mrsEssentialBabiesCarePatientConsultVitalListLayout", new Component());


}
