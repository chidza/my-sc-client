namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        deliveryId: string;

        static $inject = ["$state", "$stateParams", "InfantService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private infantService: data.IInfantService) {
            this.deliveryId = params["deliveryId"];

        }

        close = () => {
            this.state.go("consultation.management.deliverySummary.birth.list");
        }

        save = (childId: string) => {
            console.log("infantId");
            console.log(childId);
            this.infantService.getByChildId(childId).then((response) => {
                if (response.resuscitation) {
                    this.state.go("consultation.management.deliverySummary.resuscitation", { childId: childId });
                } else {
                    this.state.go("consultation.management.deliverySummary.birth.person", { childId: childId });
                }
            });

        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/birth/new.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliverySummaryBirthNewLayout", new Component());

}