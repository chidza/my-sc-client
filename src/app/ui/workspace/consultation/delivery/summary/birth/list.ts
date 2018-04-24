namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        deliveryId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.deliveryId = params["deliveryId"];

        }

        add = () => {
            this.state.go("consultation.management.deliverySummary.birth.new");
        }
        edit = (id: string) => {
            this.state.go("consultation.management.deliverySummary.birth.edit", { infantId: id });
        }
        editPerson = (id: string) => {
            this.state.go("consultation.management.deliverySummary.birth.person", { childId: id });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/birth/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliverySummaryBirthListLayout", new Component());

}
