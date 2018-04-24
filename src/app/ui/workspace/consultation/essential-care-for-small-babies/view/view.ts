namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEssentialCareForBabiesView extends ng.IController {

    }

    class Controller implements IEssentialCareForBabiesView {

        essentialCareForBabiesId: string;
       
        date: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams", "InformationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
          ) {
            this.essentialCareForBabiesId = params["essentialCareForBabiesId"];
            this.encounterId = params["encounterId"];
            this.essentialCareForBabiesId = params["essentialCareForBabiesId"];
        }

        $onInit = (): void => {
         
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/view/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientEssentialCareForBabiesViewLayout", new Component());

}
