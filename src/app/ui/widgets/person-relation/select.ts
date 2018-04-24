namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonRelationSelect extends ng.IController {
        selected: (personId: Object) => void;
    }

    class Controller implements IPersonRelationSelect {

        public selected: (personId: Object) => void;
        search: boolean = true;
        register: boolean = false;
        personId: string;
        date: string;

        static $inject = ["dialogs"];
        constructor(private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            console.log(this.date);
        }

        onRegister = () => {
            this.register = true;
            this.search = false;
        }

        onCancel = () => {
            this.search = true;
            this.register = false;
        }

        select = (id: string) => {
            if (this.personId === id) {
                this.dialog.notify("Error", "Member cannot be the same as the person");
            } else {
                this.selected({ personId: id });
            }


        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-relation/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "selected": "&",
                personId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPersonRelationSelect", new Component());

}
