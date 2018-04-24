namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        deliveryId: string;
        workareaId: string;
        currentTime: data.ICurrentTime;
        partogramInformation = {} as data.IPartogramInformation;
        missingInformation: Array<data.IPartogramMissingInfoView> = [];
        dangerSigns: Array<data.IPartogramDangerSignView> = [];
        date: string;
        value: number = 0;

        static $inject = ["$state", "$stateParams", "DeliveryService", "SiteSettingService",
            "dialogs", "PartogramInformationService", "Principal", "UserService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private siteSettingService: data.ISiteSettingService,
            private dialog: ng.dialogservice.IDialogService,
            private deliveryPartogramService: data.IPartogramInformationService,
            private Principal: security.IPrincipal,
            private userService: data.IUserService) {
            this.deliveryId = params["deliveryId"];
        }

        onRecord = () => {
            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                if (!response.endTime) {
                    this.siteSettingService.currentTime().then((response) => {
                        // this.currentTime = response;
                        console.log("checking time ");


                        let ct = response.currentTime; // moment(new Date(this.currentTime.currentTime)).format("HH:mm") + "?");                                                 

                        let times = ct.toString().split("T");


                        let dlg = this.dialog.confirm("Confirm", "Are you sure you want capture new Partogram recordings at "
                            + times[1].substring(0, 5) + "?");

                        dlg.result.then(() => {
                            this.Principal.identity().then((response) => {
                                this.userService.get(response.login).then((response) => {

                                    this.partogramInformation.date = ct;
                                    this.partogramInformation.deliveryId = this.deliveryId;
                                    this.partogramInformation.userId = response.login;
                                    this.deliveryPartogramService.save(this.partogramInformation).then((response) => {
                                        this.state.go("consultation.management.deliveryPartogram.record", { deliveryPartogramId: response.id });
                                    });
                                });

                            });
                        });


                    });
                } else {
                    let dlg = this.dialog.error("Error", "Patient out of the Active Phase!");

                    dlg.closed.then(() => {
                    });
                }
            });

        }

        partogramPrintPreview = () => {
            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                if (response.startTime) {
                    this.state.go("consultation.management.delivery.printpreview", { deliveryId: this.deliveryId });
                } else {
                    this.dialog.notify("Delivery Summary", "Nothing to show, patient is not admitted on to the partogram!");
                }
            });
        }

        $onInit = () => {
            this.siteSettingService.currentTime().then((response) => {
                this.date = moment(new Date(response.currentTime)).format("HH:mm");
                this.refresh();
            });
        }

        refresh = () => {
            this.value++;
            this.checkAlerts();
        }

        checkAlerts = () => {
            this.deliveryPartogramService.getDangerSigns(this.deliveryId).then((response) => {
                this.dangerSigns = response;
            });
            this.deliveryPartogramService.getMissingInformation(this.deliveryId).then((response) => {
                this.missingInformation = response;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/partogram/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientDeliveryPartogramMenuLayout", new Component());

}
