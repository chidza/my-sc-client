namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        onInit = () => {

        }

        onAdd = () => {
            console.log("Adding user ....");
        }

        onEdit = (login: string) => {
            console.log("Editing user .... ", login);
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/admin/users/user.html",
            public controller = Controller,
            public controllerAs = "vm") {
            this.bindings = {
            };

        }
    }

    app.component("mrsUserLayout", new Component());

}