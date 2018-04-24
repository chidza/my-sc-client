namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramNoteList extends ng.IController {
        editPartogramNote: (partogramNoteId: Object) => void;
        addPartogramNote: () => void;
    }

    class Controller implements IPartogramNoteList {
        deliveryId: string;
        partogramNotes: Array<data.IPartogramNote> = [];
        loggedOnUserId: any;
        endTime: any;
        status: boolean;

        public editPartogramNote: (partogramNoteId: Object) => void;
        public addPartogramNote: () => void;

        static $inject = ["PartogramNoteService", "dialogs", "Principal", "UserService", "SiteSettingService"];
        constructor(private partogramNoteService: data.IPartogramNoteService,
            private dialog: ng.dialogservice.IDialogService,
            private principal: security.IPrincipal,
            private userService: data.IUserService,
            private siteSettingService: data.ISiteSettingService) {

        }


        $onInit = () => {
            if (this.deliveryId) {
                this.partogramNoteService.getPartogramNotes(this.deliveryId).then((response) => {
                    this.partogramNotes = response;
                    console.log(this.partogramNotes);
                });
            }

            this.principal.identity().then((response) => {
                this.userService.get(response.login).then((response) => {
                    this.loggedOnUserId = response.id;
                });

            });
            this.siteSettingService.currentTime().then((response) => {
                this.endTime = moment(response.currentTime); // moment(new Date(this.currentTime.currentTime)).format("HH:mm") + "?");                                                 
            });
        }



        edit = (item: data.IPartogramNote) => {
            this.editPartogramNote({ partogramNoteId: item.id });
        }

        remove = (item: data.IPartogramNote) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.partogramNoteService.remove(item.id).then((response) => {
                    this.partogramNotes.splice(this.partogramNotes.indexOf(item), 1);
                });
            }, (error) => {

            });
        }

        add = () => {
            console.log("add");
            this.addPartogramNote();
        }

        subTime = (model: data.IPartogramInformation) => {
            let date: string;
            date = model.date;
            let startTime = moment(date, "YYYY-MM-DDTHH:mm:ss");
            let duration = this.endTime.diff(startTime, "minutes");
            if (duration < 30) {
                this.status = false;
                /* if (this.loggedOnUserId === model.userId) {
                    this.status = false;
                } else {
                    this.status = true;
                } */
            } else {
                this.status = true;
            }
            return this.status;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/partogram-notes/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editPartogramNote: "&",
                addPartogramNote: "&",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsPartogramNoteList", new Component());

}
