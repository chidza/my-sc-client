namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;

        static $inject = ["$state", "$stateParams", "AncService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancService: data.IAncService) {
            this.personId = params["personId"];
            console.log(params);
        }

        close = (deliveryId: string) => {
            this.ancService.getByDelivery(deliveryId).then((response) => {
                console.log(deliveryId, "deliveryId");
                this.state.go("consultation.management.ancregistration.previousPregnancies.edit", { previousAncId: response.id });
            });

        }

        childSaved = () => {
            // this.state.go("consultation.management.ancregistration.previousPregnancies.edit", { previousAncId: id });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/previous-pregnancy/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientAncPreviousPregnanciesAddLayout", new Component());

}
