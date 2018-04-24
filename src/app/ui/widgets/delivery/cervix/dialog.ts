namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ICervixDialog extends ng.IController {
        closed: () => void;
        admit: () => void;
        saved: (cervixId: Object) => void;
    }

    class Controller implements ICervixDialog {

        cervixId: string;
        deliveryId: string;
        cervix = {} as data.ICervix;
        delivery = {} as data.IDelivery;
        datePickerOpenStatus = {};
        levels: Array<data.ILevelOfPresentingPart> = [];
        section: string;
        msg: string;
        status: data.IDilatationStatus;
        date: String;
        // descentStatus: data.IDescentStatus;

        public closed: () => void;
        public saved: (cervixId: Object) => void;
        public admit: () => void;


        static $inject = ["CervixService", "LevelOfPresentingPartService", "DeliveryService",
            "dialogs", "DateUtils", "SiteSettingService"];
        constructor(private cervixService: data.ICervixService,
            private levelOfPresentingPartService: data.ILevelOfPresentingPartService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) {

        }


        $onInit = (): void => {
            this.levelOfPresentingPartService.query().then((response) => {
                this.levels = response;
            });

            this.cervixService.get(this.cervixId).then((response) => {
                this.cervix = response;
            }, (error) => {
                this.cervix.deliveryId = this.deliveryId;

                console.log(this);
                if (this.date) {
                    this.cervix.time = new Date(moment(this.date));
                } else {
                    this.siteSettingService.currentTime().then((response) => {
                        // this.currentTime = response;
                        console.log("checking time ");
                        let ct = response.currentTime;
                        const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                        console.log(myDate);
                        this.cervix.time = new Date(myDate);
                    });
                }
            });

        }

        openCalendar = (date: any) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }

        save = () => {

            if (this.cervix.id !== "") {
                this.onSave(this.cervixService.update(this.cervix));
            }
            else {

                this.onSave(this.cervixService.save(this.cervix));
            }
        }

        onSave = (promise: ng.IPromise<data.ICervix>) => {
            promise.then((response) => {
                this.deliveryService.checkDilatation(this.deliveryId, response.id).then((status) => {
                    this.status = status;
                    this.cervixId = response.id;
                    if (this.status.action === "DANGER") {
                        this.showMsg("Patient progress crossing the action line");
                    } else {
                        if (this.status.transfer === "DANGER") {
                            this.showMsg("Patient progress crossing the transfer line");
                        } else {
                            if (this.status.alert === "DANGER") {
                                this.showMsg("Patient progress crossing the alert line");
                            } else {
                                this.saved({ cervixId: this.cervixId });
                                // checkdescent
                                /* this.deliveryService.checkDescent(this.deliveryId, response.id).then((response) => {
                                     this.descentStatus = response;
                                      
                                     if (this.descentStatus.descent === "DANGER") {
                                         this.showMsg("The descent of the head warning ");
                                     } else {
                                        
                                     }
                                 });*/
                            }
                        }
                    }
                });
            }, () => {
                // error!
            });
        }

        close = () => {
            this.closed();
        }

        showMsg = (msg: string) => {
            let dlg = this.dialog.notify("ePartograph Alert", msg);
            dlg.result.then((btn) => {
                this.saved({ cervixId: this.cervixId });
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/cervix/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                cervixId: "<",
                deliveryId: "<",
                section: "@",
                date: "<",
                saved: "&",
                closed: "&",
                admit: "&"
            };

        }
    }

    app.component("mrsCervixDialog", new Component());

}
