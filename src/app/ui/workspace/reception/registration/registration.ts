namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {
        personId: string;

        static $inject = ["dialogs", "$uibModal", "$state"];
        constructor(private dialog: ng.dialogservice.IDialogService,
            private modal: ng.ui.bootstrap.IModalService,
            private state: ng.ui.IStateService) {

        }

        open = (personId: string) => {
            this.state.go("reception.management.overview", { personId: personId });
        }

        cancel = () => {
            this.state.go("reception.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/registration/registration.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionRegistration", new Component());

}
