namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonPhoneList extends ng.IController {
        editPersonPhone: (phoneId: Object) => void;
        addPersonPhone: () => void;
    }

    class Controller implements IPersonPhoneList {
        public editPersonPhone: (phoneId: Object) => void;
        public addPersonPhone: () => void;
        personId: string;
        personPhones: Array<data.IPhone> = [];

        static $inject = ["PhoneService", "dialogs"];
        constructor(private PersonPhoneService: data.IPhoneService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.PersonPhoneService.getByPersonId(this.personId).then((response) => {
                    this.personPhones = response;

                });
            }
        }

        editPhone = (item: data.IPhone) => {
            this.editPersonPhone({ phoneId: item.id });
        }

        remove = (item: data.IPhone) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.PersonPhoneService.remove(item.id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addPersonPhone();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-phone/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editPersonPhone: "&",
                addPersonPhone: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsPersonPhoneList", new Component());

}
