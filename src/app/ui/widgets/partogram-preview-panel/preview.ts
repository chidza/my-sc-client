namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramPreview extends ng.IController {
        saved: (deliveryPartogramId: Object) => void;
    }

    class Controller implements IDeliveryPartogramPreview {

        personId: string;
        delivery: data.IDelivery;
        deliveryId: string;
        $router: any;
        start: string;
        personFullName: string;
        end: string;
        from: string;
        to: string;
        partogramInformation = {} as data.IPartogramInformation;
        encounterId: string;
        partogramNotes: Array<data.IPartogramNote> = [];
        fetalHeartRateId: string;
        pulseId: string;
        bpId: string;
        temperatureId: string;

        public saved: (deliveryPartogramId: Object) => void;

        static $inject = ["PersonService", "$state", "$stateParams", "DeliveryService", "SiteSettingService", "dialogs", "PartogramInformationService", "Principal", "UserService", "PartogramNoteService"];
        constructor(
            private personService: data.IPersonService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private siteSettingService: data.ISiteSettingService,
            private dialog: ng.dialogservice.IDialogService,
            private deliveryPartogramService: data.IPartogramInformationService,
            private Principal: security.IPrincipal,
            private userService: data.IUserService,
            private partogramNoteService: data.IPartogramNoteService
        ) {
            this.deliveryId = params["deliveryId"];
            this.encounterId = params["encounterId"];
        }

        onRecord = () => {
            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                if (!response.endTime) {
                    this.siteSettingService.currentTime().then((response) => {


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
                                        console.log("about to call state");
                                        this.saved({ deliveryPartogramId: response.id });
                                        // this.state.go("consultation.management.deliveryPartogram.record", { deliveryId : this.deliveryId, deliveryPartogramId: response.id });
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

        $onInit = () => {

            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID).then((response) => {
                this.fetalHeartRateId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.PULSE_ID).then((response) => {
                this.pulseId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.TEMPERATURE_ID).then((response) => {
                this.temperatureId = response.value;
            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;
            });


            this.deliveryService.get(this.deliveryId).then((response) => {
                this.delivery = response;
                this.deliveryId = response.id;
                this.personId = response.personId;


                this.personService.get(this.personId).then((response) => {

                    this.personFullName = response.firstname + "-" + response.lastname + "-Partogram";
                });

                this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                    if (response.startTime)
                        this.start = response.startTime;
                    if (response.startTime)
                        this.end = response.endTime;
                });

                if (this.deliveryId) {
                    this.partogramNoteService.getPartogramNotes(this.deliveryId).then((response) => {
                        this.partogramNotes = response;
                    });
                }


            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram-preview-panel/preview.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "saved": "&"
            };

        }
    }

    app.component("mrsDeliveryPartogramPreview", new Component());

}