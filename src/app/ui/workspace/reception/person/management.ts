namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
    }

    class Controller implements ng.IController {

        personId: string;

        static $inject = ["$stateParams"];
        constructor(stateParams: IParams) {
            this.personId = stateParams.personId;
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/management.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionFileManagement", new Component());

}
