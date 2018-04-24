namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryCervix extends ng.IController {

    }

    class Controller implements IDeliveryCervix {
        personId: string;
        encounterId: string;
        delivery: data.IDelivery;
        deliveryId: string;
        partogramInformation = {} as data.IPartogramInformation;


        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs", "CervixService",
            "PartogramInformationService", "Principal", "UserService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private cervixService: data.ICervixService,
            private deliveryPartogramService: data.IPartogramInformationService,
            private Principal: security.IPrincipal,
            private userService: data.IUserService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
            });
        }

        onClose = () => {
            this.state.go("consultation.management.deliveryMonitoring.cervices.list");
        }

        onSave = (cervixId: string) => {

            this.cervixService.get(cervixId).then((response) => {
                if (response.dilatation > 3) {
                    let dlg = this.dialog.notify("Patient Monitoring", "Patient admitted onto the partogram. You will now be redirected to the Partogram module!");
                    dlg.result.then((btn) => {
                        this.deliveryPartogramService.getByDeliveryIdAndDate(this.deliveryId, response.time).then((response) => {
                            this.state.go("consultation.management.deliveryPartogram.record", { deliveryId: this.deliveryId, deliveryPartogramId: response.id });
                        });
                    });
                } else {
                    this.state.go("consultation.management.deliveryMonitoring.cervices.list");
                }
            });
            //this.state.go("consultation.management.deliveryPartogram.overview", { deliveryId: this.deliveryId });

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/monitoring/cervix/cervix-add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliveryMonitoringCerviceAddLayout", new Component());

}
