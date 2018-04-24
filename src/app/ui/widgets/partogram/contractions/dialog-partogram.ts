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
        date: string;
        deliveryId: string;
        contraction = {} as data.IContraction;
        datePickerOpenStatus = {};
        public closed: () => void;
        public saved: (contractionId: Object) => void;
        show: boolean;
        counter: number = 0;
        contractionsList: Array<data.IContraction> = [];
        notification: data.IContractionValidation;


        static $inject = ["ContractionService", "dialogs"];
        constructor(private contractionService: data.IContractionService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.deliveryId && this.date) {
                this.contractionService.getContractionsByDeliveryIdAndDate(this.deliveryId, this.date).then((reponse) => {
                    this.contractionsList = reponse;
                    if (this.contractionsList.length > 0) {
                        this.count = this.contractionsList.length;
                        this.show = true;
                    }
                });
            }
        }


        openCalendar = (date: string) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }
        save = (element: data.IContraction) => {

            if (+element.dilation <= 20) {
                element.strength = "WEAK";
            } else if (+element.dilation > 20 && +element.dilation <= 40) {
                element.strength = "MODERATE";
            } else {
                element.strength = "STRONG";
            }

            if (element.id) {
                this.onUpdate(this.contractionService.update(element));
            }
            else {
                element.date = new Date(moment(this.date));
                console.log(element);
                this.contractionService.save(element).then((response) => {
                    element.id = response.id;
                    this.validateContraction(response.date);
                });

            }
        }

        onSave = (promise: ng.IPromise<data.IContraction>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    console.log("response");
                    console.log(response[0].date);
                    this.saved({ contractionId: response });
                }
            }, () => {
            });
        }

        onUpdate = (promise: ng.IPromise<data.IContraction>) => {
            promise.then((response) => {
                if (this.saved != null) {

                    this.saved({ contractionId: response });
                }
            }, () => {
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
                item.date = this.contraction.date;
                item.deliveryId = this.deliveryId;
                item.frequency = i;
                this.contractionsList.push(item);
                console.log("contractions", this.contractionsList);
            }

        }

        addNewChoice = (count: number) => {
            this.show = true;
            let newItemNo = this.contractionsList.length + 1;
            let item = {} as data.IContraction;
            item.date = this.contraction.date;
            item.deliveryId = this.deliveryId;
            item.frequency = newItemNo;
            this.contractionsList.push(item);
            this.count = this.contractionsList.length;

        }

        removeChoice = function (index: number, id: string) {
            if (id) {


                let dlg = this.dialog.confirm("Delete Contraction", "Are you sure you want to remove the selected contraction");

                dlg.result.then((btn: any) => {
                    this.contractionService.remove(id).then((response: any) => {
                        this.contractionsList.splice(index, 1);
                        this.count = this.contractionsList.length;
                    }, (error: any) => {
                    });
                }, () => {
                });

            } else {
                this.contractionsList.splice(index, 1);
                this.count = this.contractionsList.length;
            }

        };

        changeDuration = (count: number, duration: number) => {
            this.contractionsList.forEach((contr) => {
                if (contr.frequency === count) {
                    contr.dilation = duration;
                }
            });

        }

        validateContraction = (date: Date) => {
            console.log("this.deliveryId");
            console.log(this.deliveryId);

            this.contractionService.checkContractionsByDeliveryAndDateTime(this.deliveryId, moment(date).format("YYYY-MM-DDTHH:mm:ss")).then((res) => {
                this.notification = res;
                if (this.notification.frequency === "DANGER" || this.notification.trend === "DANGER" || this.notification.distribution === "DANGER") {
                    let dlg = this.dialog.error("Contractions Alert", "Client has more than five(5) contractions");

                    dlg.result.then((btn) => {
                        console.log("validation ok");
                        console.log(res);

                    }, () => {
                        console.log("validation cancelled");
                        console.log(res);

                    });

                } else {

                }
            }, (error) => {

            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/contractions/dialog-partogram.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsContrationPartogramDialog", new Component());

}
