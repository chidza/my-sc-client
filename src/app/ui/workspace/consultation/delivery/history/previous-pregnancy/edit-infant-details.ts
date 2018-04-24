namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        infantId: string;
        ancId: string;
        static $inject = ["$state", "$stateParams", "InfantService", "DeliveryService", "AncService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private infantService: data.IInfantService,
            private deliveryService: data.IDeliveryService,
            private ancService: data.IAncService) {
            this.infantId = params["infantId"];
            this.ancId 
            console.log(params);
        }

        $onInit = () => {
            this.infantService.get(this.infantId).then((response)=>{
                this.deliveryService.get(response.deliveryId).then((response)=>{
                    this.ancService.getByDelivery(response.id).then((response)=>{
                         this.ancId = response.id;
                    });
                    
                });
            });
        }

        close = () => {
            this.state.go("consultation.management.deliveryRegistration.previousPregnancies.edit", {previousAncId: this.ancId});
        }

        childSaved = () => {
            this.state.go("consultation.management.deliveryRegistration.previousPregnancies.edit", {previousAncId: this.ancId});
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/history/previous-pregnancy/edit-infant-details.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryPreviousPregnanciesEditInfantLayout", new Component());

}
