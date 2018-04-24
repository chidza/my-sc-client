namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryActivePhaseLabourPatients extends ng.IController {
        editDelivery: (deliveryId: Object) => void;
    }

    class Controller implements IDeliveryActivePhaseLabourPatients {

        public editDelivery: (deliveryId: Object) => void;

        deliveryPerson = {} as data.IPersonDelivery;
        person = {} as data.IPerson;

        static $inject = ["DeliveryService", "PersonService"];
        constructor(private deliveryService: data.IDeliveryService,
            private personService: data.IPersonService) {
        }

        $onInit = () => {
            this.deliveryService.getActiveLabourPhaseDeliveries().then((response) => {
                this.deliveryPerson = response;
                console.log("delivery");
                console.log(this.deliveryPerson);

            });
        }

        edit = (item: data.IDelivery) => {
            console.log("item");
            console.log(item);
            this.editDelivery({ deliveryId: item.id });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/active-labour-phase-delivery/delivery-active-phase.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editDelivery: "&",
            };

        }
    }

    app.component("mrsDeliveryActivePhaseLabourPatients", new Component());

}
