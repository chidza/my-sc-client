namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
        emailId: string;
    }

    class Controller implements ng.IController {
        personId: string;
        emailId: string;
        personEmail: data.IEmail;

        static $inject = ["EmailService", "dialogs", "$state", "$stateParams"];
        constructor(private personEmailService: data.IEmailService,
            private dialog: ng.dialogservice.IDialogService,
            private state: ng.ui.IStateService, params: IParams) {
            this.personId = params.personId;
            this.emailId = params.emailId;
        }

        onClose = () => {
            this.state.go("reception.management.contactdetail", { personId: this.personId });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/contact-details/edit-email.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionFileManagementContactDetailEmailEdit", new Component());

}
