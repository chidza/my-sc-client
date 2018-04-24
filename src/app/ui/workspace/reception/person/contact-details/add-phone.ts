namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
    }

    class Controller implements ng.IController {
        personId: string;
        phoneId: string;
        phone: data.IPhone;

        static $inject = ["PhoneService", "dialogs", "$state", "$stateParams"];
        constructor(private personPhoneService: data.IPhoneService,
            private dialog: ng.dialogservice.IDialogService,
            private state: ng.ui.IStateService, params: IParams) {
            this.personId = params.personId;
        }

        $onInit = (): void => {

            this.personPhoneService.get(this.personId).then((response) => {
                this.phone = response;
            });

        }

        onClose = () => {
            this.state.go("reception.management.contactdetail", { personId: this.personId });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/contact-details/add-phone.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionFileManagementContactDetailPhoneAdd", new Component());

}
