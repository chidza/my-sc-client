namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        deliveryId: string;
        infantId: string;
        static $inject = ["$state", "$stateParams", "InfantService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private infantService: data.IInfantService) {
            this.deliveryId = params["deliveryId"];
            this.infantId = params["infantId"];
            console.log(params);
        }

        close = () => {
            this.state.go("consultation.management.deliverySummary.birth.list");
        }

        updateResuscitationItems = () => {
            this.infantService.get(this.infantId).then((response) => {
            console.log(this.infantId, "this.infantId this.infantId this.infantId");
            this.state.go("consultation.management.deliverySummary.resuscitationEdit", { childId: response.personId, state: "editing" });
            }, (error) => {
                console.log(error);
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/birth/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliverySummaryBirthEditLayout", new Component());

}