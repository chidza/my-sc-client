namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        lastVisited: string;

        static $inject = ["$state", "$stateParams"];
        constructor(public state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.lastVisited = params["lastVisited"];
        }

        closeHts = () => {
            this.state.go("consultation.purpose.list", { workareaId: this.workareaId, personId: this.personId });
           /*  if (this.lastVisited == "none") {
                this.state.go("consultation.purpose.list", { workareaId: this.workareaId, personId: this.personId });
            } else {
                window.location.href = this.lastVisited;
            } */


        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/hts/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientHtsMenuLayout", new Component());

}
