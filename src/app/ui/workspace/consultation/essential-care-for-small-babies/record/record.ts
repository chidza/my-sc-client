namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEssentialCareForBabiesNewRecord extends ng.IController {

    }

    class Controller implements IEssentialCareForBabiesNewRecord {

        essentialCareForBabiesId: string;
        date: string;
        encounterId: string;


        static $inject = ["$state", "$stateParams", "SiteSettingService"];
        constructor(
            private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private siteSettingService: data.ISiteSettingService
        ) {
            this.essentialCareForBabiesId = params["essentialBabyCareId"];

            this.encounterId = params["encounterId"];

        }

        $onInit = (): void => {


            this.siteSettingService.currentTime().then((response) => {


                this.date = moment(response.currentTime).format("YYYY-MM-DDTHH:mm:00");
            });

        }
        onClose = () => {
            this.state.go("consultation.management.essentialCareForBabies.overview");
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/record/record.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientEssentialCareForBabiesRecordLayout", new Component());

}
