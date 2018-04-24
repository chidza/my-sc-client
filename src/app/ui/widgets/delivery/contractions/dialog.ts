namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IContrationDialog extends ng.IController {
        closed: () => void;
        saved: (contractionId: Object) => void;
    }

    class Controller implements IContrationDialog {

        contractionId: string;
        count: number;
        deliveryId: string;
        contraction = {} as data.IContraction;
        datePickerOpenStatus = {};
        public closed: () => void;
        public saved: (contractionId: Object) => void;
        show: boolean;
        counter: number = 0;
        contractionsList: Array<data.IContraction> = [];
        notification: data.IContractionValidation;
        contractionServerDate: Date;


        static $inject = ["ContractionService", "dialogs", "DateUtils", "SiteSettingService"];
        constructor(private contractionService: data.IContractionService,
            private dialog: ng.dialogservice.IDialogService,
            private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) {

        }

        $onInit = () => {

            this.contractionService.get(this.contractionId).then((response) => {
                this.contraction = response;
            }, (error) => {
                console.log(error);
                console.log("init delivery id", this.deliveryId);
                this.siteSettingService.currentTime().then((response) => {
                    console.log("checking time ");
                    let ct = response.currentTime;
                    const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                    this.contraction.date = new Date(myDate);
                    this.contractionServerDate = new Date(myDate);
                });
                if ((angular.isDefined(error.status)) && (error.status === 404)) {
                    // not found - initialise variable here
                    this.contraction.deliveryId = this.deliveryId;
                } else {
                    // serious error!
                }
            });
        }


        openCalendar = (date: string) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }
        save = () => {
            if (this.contraction.id) {
                this.onUpdate(this.contractionService.update(this.contraction));
            }
            else {
                this.onSave(this.contractionService.saveMultipleContractions(this.contractionsList));
                console.log("this is the contractions list", this.contractionsList);
            }
        }

        onSave = (promise: ng.IPromise<Array<data.IContraction>>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    console.log("response");
                    console.log(response[0].date);
                    this.contractionService.checkContractionsByDeliveryAndDateTime(this.deliveryId, moment(response[0].date).format("YYYY-MM-DDTHH:mm:ss")).then((res) => {
                        this.notification = res;
                        if (this.notification.frequency === "DANGER" || this.notification.trend === "DANGER" || this.notification.distribution === "DANGER") {
                            // this.dialog.error("Contractions Alert", "Contractions Alert");

                            let dlg = this.dialog.error("Danger Alert!", "Abnormal Contractions.");

                            dlg.result.then((btn) => {
                                console.log("validation ok");
                                console.log(res);
                                this.saved({ contractionId: response });
                            }, () => {
                                console.log("validation cancelled");
                                console.log(res);
                                this.saved({ contractionId: response });
                            });

                        } else {
                            this.saved({ contractionId: response });
                        }
                    }, (error) => {

                    });
                    //
                }
            }, () => {
                // error!
            });
        }

        onUpdate = (promise: ng.IPromise<data.IContraction>) => {
            promise.then((response) => {
                console.log("response contractions");
                console.log(response);
                if (this.saved != null) {
                    this.saved({ contractionId: response });
                }
            }, () => {
                // error!
            });
        }

        close = () => {
            this.closed();
        }


        newItem = (count: number) => {


            this.show = true;
            this.counter++;
            this.contractionsList = [];
            for (let i = 1; i <= count; i++) {
                let item = {} as data.IContraction;
                console.log(this.contractionServerDate, "this.contraction.date");
                item.date = this.contractionServerDate;
                item.deliveryId = this.deliveryId;
                item.frequency = i;
                this.contractionsList.push(item);
                console.log("contractions", this.contractionsList);
            }

        }

        changeDuration = (count: number, duration: number) => {
            this.contractionsList.forEach((contr) => {
                if (contr.frequency === count) {
                    contr.dilation = duration;
                }
            });

        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/contractions/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                contractionId: "<",
                deliveryId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsContrationDialog", new Component());

}
