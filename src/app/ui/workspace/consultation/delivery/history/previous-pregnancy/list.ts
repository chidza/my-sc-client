namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;
        ancId: string;
        deliveryId: string;

        static $inject = ["$state", "$stateParams", "DeliveryService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService) {
            this.personId = params["personId"];
           this.ancId = params["ancId"];
           this.deliveryId = params["deliveryId"];
           console.log(params);
        }

        view = () => {

        }

        $onInit = () => {
            /* this.deliveryService.get
            this.deliveryId */
        }

        edit = (id: string) => {
            this.state.go("consultation.management.deliveryRegistration.previousPregnancies.edit", {previousAncId: id});
        }

        add = () => {
            this.state.go("consultation.management.deliveryRegistration.previousPregnancies.add");
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = " app/ui/workspace/consultation/delivery/history/previous-pregnancy/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryRegistrationPreviousPregnanciesListLayout", new Component());

}
