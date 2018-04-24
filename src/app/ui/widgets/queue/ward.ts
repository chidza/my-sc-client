namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAdmission extends ng.IController {
        personSelected: (personId: Object) => void;
    }

    interface IPersonDeliveryState {
        patientInDanger: boolean;
        patientInActivePhase: boolean;
        patientMinsToNextReading: number;
    }

    class Controller implements IAdmission {
        people: Array<data.IPerson> = [];

        wardId: string;
        ward: data.IWard;
        deliveryWards: Array<data.IDeliveryWardNotification> = [];
        patientInDanger: boolean = false;
        patientInActivePhase: boolean = false;
        patientMinsToNextReading: number;
        deliveryState = {} as IPersonDeliveryState;

        public personSelected: (personId: Object) => void;

        static $inject = ["AdmissionService", "WebSocketService", "$scope", "WardService"];
        constructor(private AdmissionService: data.IAdmissionService,
            private websocket: utils.IWebSocketService,
            private scope: ng.IScope,
            private wardService: data.IWardService) {

        }
        $onInit = () => {

            this.websocket.connect();

            this.websocket.subscribe("/topic/delivery-ward-notification");

            this.AdmissionService.people(this.wardId).then((response) => {
                this.people = response;
                this.websocket.message = (data: any) => {
                    this.deliveryWards = data;
                    this.scope.$apply();
                };
            }, (error) => {
                console.log(error);
            });
            this.wardService.get(this.wardId).then((response) => {
                this.ward = response;
            });






        }
        check = (personId: string): IPersonDeliveryState => {

            this.deliveryWards.forEach(d => {
                if (d.personId === personId) {

                    if (d.alertLineStatus === "OK" || d.transferLineStatus === "OK" || d.actionLineStatus === "OK") {
                        this.deliveryState.patientInDanger = false;

                    } else {
                        this.deliveryState.patientInDanger = true;
                    }
                    if (d.active) {
                        this.deliveryState.patientInActivePhase = true;
                    } else {
                        this.deliveryState.patientInActivePhase = false;
                    }
                    if (d.minsToNextReading) {
                        this.deliveryState.patientMinsToNextReading = d.minsToNextReading;
                    } else {
                        this.deliveryState.patientMinsToNextReading = null;
                    }




                }
            });

            return this.deliveryState;

        }

        $onDestroy = () => {
            this.websocket.unsubscribe();
            this.websocket.disconnect();


        }

        onPersonSelected = (person: data.IPerson) => {
            console.log(person, "person");
            this.personSelected({ personId: person.id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/queue/ward.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                wardId: "<",
                personSelected: "&"
            };

        }
    }

    app.component("mrsWardQueue", new Component());

}
