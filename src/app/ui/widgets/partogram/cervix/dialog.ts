namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ICervixDialog extends ng.IController {
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
        date: string;
        // descentStatus: data.IDescentStatus;


        static $inject = ["CervixService", "LevelOfPresentingPartService", "DeliveryService", "dialogs", "DateUtils"];
        constructor(private cervixService: data.ICervixService,
            private levelOfPresentingPartService: data.ILevelOfPresentingPartService, private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService, private dateUtils: utils.IDateUtils) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();

        }

        init = () => {
            if (this.deliveryId && this.date) {
                this.cervixService.getCervixesByDeliveryDateTime(this.deliveryId, this.date).then((response) => {
                    this.cervix = response;
                }, (error) => {
                    this.cervix.deliveryId = this.deliveryId;
                    this.cervix.time = new Date(moment(this.date));
                });
            }
        }
        $onInit = () => {
            this.levelOfPresentingPartService.query().then((response) => {
                this.levels = response;
            });
        }



        openCalendar = (date: any) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }

        save = () => {
            console.log("this.cervix");
            console.log(this.cervix);
            if (this.cervix.dilatation && this.cervix.descentId) {
                if (this.cervix.id !== "") {
                    this.onSave(this.cervixService.update(this.cervix));
                }
                else {
                    this.onSave(this.cervixService.save(this.cervix));
                }
            }
        }

        onSave = (promise: ng.IPromise<data.ICervix>) => {
            promise.then((response) => {
                this.cervix.id = response.id;
                this.deliveryService.checkDilatation(this.deliveryId, response.id).then((response) => {
                    this.status = response;
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
                                // this.saved({ cervixId: response.id });
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

        showMsg = (msg: string) => {
            let dlg = this.dialog.notify("ePartograph Alert", msg);


            dlg.result.then((btn) => {

                // this.saved({ cervixId: this.cervixId });
            });
        }

        clear = () => {
            if (this.cervix.id) {
                this.cervixService.remove(this.cervix.id).then((response) => {
                    this.cervix = {} as data.ICervix;
                    this.init();
                });
            }
        }
    }
    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/cervix/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsCervixPartogramDialog", new Component());

}
