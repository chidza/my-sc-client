namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEssentialCareForBabiesAlerts extends ng.IController {

    }

    class Controller implements IEssentialCareForBabiesAlerts {

        essentialCareForBabiesId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {
            this.essentialCareForBabiesId = params["essentialCareForBabiesId"];

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/alerts/alerts.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientEssentialCareForBabiesAlertsLayout", new Component());

}
