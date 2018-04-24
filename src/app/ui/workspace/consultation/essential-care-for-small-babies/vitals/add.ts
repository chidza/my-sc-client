namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStateParams extends ng.ui.IStateParamsService {
        personId: string;
        vitalId: string;
        encounterId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        vitalId: string;
        encounterId: string;
        date: string;
        essentialBabyCareId: string;

        static $inject = ["EssentialBabiesCareService", "SiteSettingService", "$state", "$stateParams"];
        constructor(
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private siteSettingService: data.ISiteSettingService,
            private state: ng.ui.IStateService,
            private params: IStateParams) {
            this.personId = params["personId"];
            this.vitalId = params["vitalId"];
            this.encounterId = params["encounterId"];
            this.essentialBabyCareId = params["essentialBabyCareId"];

            console.log("params");
            console.log(params);
        }


        saveEssentialBabiesCareVital = (personVitalId: string) => {
            console.log("personVitalId===>>> saving now=====>>");
            console.log(personVitalId);
            this.essentialBabiesCareService.addEssentialBabiesCareVitals(this.essentialBabyCareId, personVitalId).then((response) => {
                this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: this.essentialBabyCareId });

            });
        }

        close = (id: string, personVitalId: string): void => {
            this.saveEssentialBabiesCareVital(personVitalId);
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/vitals/add.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsEssentialBabiesCarePatientConsultVitalAddLayout", new Component());

}
