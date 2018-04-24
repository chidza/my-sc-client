namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonEmailList extends ng.IController {
        editPersonEmail: (emailId: Object) => void;
        addPersonEmail: () => void;
    }

    class Controller implements IPersonEmailList {
        public editPersonEmail: (emailId: Object) => void;
        public addPersonEmail: () => void;
        personId: string;
        personEmails: Array<data.IEmail> = [];

        static $inject = ["EmailService", "dialogs"];
        constructor(private PersonEmailService: data.IEmailService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.PersonEmailService.getByPersonId(this.personId).then((response) => {
                    this.personEmails = response;

                });
            }
        }

        editEmail = (item: data.IEmail) => {
            this.editPersonEmail({ emailId: item.id });
        }

        remove = (item: data.IEmail) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.PersonEmailService.remove(item.id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addPersonEmail();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-email/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editPersonEmail: "&",
                addPersonEmail: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsPersonEmailList", new Component());

}
