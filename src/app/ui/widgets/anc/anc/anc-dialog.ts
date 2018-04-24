namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncDialog extends ng.IController {
        saved: () => void;
        closed: () => void;
    }

    class Controller implements IAncDialog {

        date: Date;
        personId: string;
        showHideButton: boolean;
        hivStatus: data.IHivStatus;

        anc = {} as data.IAnc;
        feedingOptions: Array<data.IFeedingOption> = [];
        datePickerOpenStatus = {};

        public saved: () => void;
        public closed: () => void;

        static $inject = ["AncService", "FeedingOptionService", "dialogs", "PersonService"];
        constructor(private ancService: data.IAncService,
            private feedingOptionService: data.IFeedingOptionService,
            private dialog: ng.dialogservice.IDialogService,
            private personService: data.IPersonService) {

        }

        $onInit = () => {
            this.ancService.current(this.personId).then((response) => {
                this.anc = response;
                this.showHideButton = false;
                let hivStatusDate: Date;

                let n = 1;
                let ancDayMinusOne = moment(this.anc.date).subtract(n, "day"); // HIV prior to booking should get status before registration

                console.log(ancDayMinusOne.toDate, "hivStatusDate");
                this.personService.hivStatus(this.personId, ancDayMinusOne.toDate()).then((response) => {
                    this.hivStatus = response;
                    console.log(response);
                });
            }, (error) => {
                this.anc.date = new Date();
                this.showHideButton = true;
                let n = 1;
                let ancDayMinusOne = moment(this.anc.date).subtract(n, "day"); // HIV prior to booking should get status before registration
                this.personService.hivStatus(this.personId, ancDayMinusOne.toDate()).then((response) => {
                    this.hivStatus = response;
                });
            });

            this.feedingOptionService.query("").then((response) => {
                this.feedingOptions = response;
            });

        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            if ((moment().diff(this.anc.lnmp, "days") > 0) === true && (moment().diff(this.anc.date, "days") >= 0) === true) {
                if (this.anc.id) {
                    this.ancService.update(this.anc).then((response) => {
                        this.anc = response;
                        this.saved();
                    });
                }
                else {
                    this.anc.personId = this.personId;
                    this.anc.outcome = "CURRENT";
                    this.ancService.save(this.anc).then((response) => {
                        this.anc = response;
                        this.saved();
                    });
                }
            } else {
                this.dialog.error("Date", "Date cannot be in the future");

            }
        }

        onSave = (promise: ng.IPromise<data.IAnc>) => {
            promise.then((response) => {
                this.anc = response;
                this.saved();
            }, () => {

            });
        }

        generateAncNumber = () => {
            this.ancService.generate().then((response) => {
                this.anc.number = response.number;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc/anc/anc-dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsAncDialog", new Component());

}
