namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramNoteDialog extends ng.IController {
        closed: () => void;
        saved: (partogramNoteId: Object) => void;
    }

    class Controller implements IPartogramNoteDialog {

        partogramNoteId: string;
        count: number;
        deliveryId: string;
        partogramNote = {} as data.IPartogramNote;
        datePickerOpenStatus = {};
        public closed: () => void;
        public saved: (partogramNoteId: Object) => void;
        show: boolean;
        counter: number = 0;
        partogramNotesList: Array<data.IPartogramNote> = [];



        static $inject = ["PartogramNoteService", "dialogs", "DateUtils", "SiteSettingService"];
        constructor(private partogramNoteService: data.IPartogramNoteService,
            private dialog: ng.dialogservice.IDialogService,
            private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            console.log(this.partogramNoteId, "this.partogramNoteId");
            this.partogramNoteService.get(this.partogramNoteId).then((response) => {
                this.partogramNote = response;
            }, (error) => {
                console.log(error);
                console.log("init delivery id", this.deliveryId);
                if ((angular.isDefined(error.status)) && (error.status === 404)) {
                    // not found - initialise variable here
                    this.partogramNote.deliveryId = this.deliveryId;

                    this.siteSettingService.currentTime().then((response) => {
                        let ct = response.currentTime;
                        const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                        this.partogramNote.date = new Date(myDate);
                    });

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
            if (this.partogramNote.id !== "") {
                this.onSave(this.partogramNoteService.update(this.partogramNote));
            }
            else {
                this.onSave(this.partogramNoteService.save(this.partogramNote));
                console.log("this is the partogramNotes list", this.partogramNote);
            }
        }

        onSave = (promise: ng.IPromise<data.IPartogramNote>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    console.log("response");
                    this.saved({ partogramNoteId: response });
                }
            }, (error) => {

            });
        }

        close = () => {
            this.closed();
        }




    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/partogram-notes/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                partogramNoteId: "<",
                deliveryId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsPartogramNoteDialog", new Component());

}
