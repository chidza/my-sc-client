namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
        addressId: string;
    }

    class Controller implements ng.IController {
        personId: string;
        addressId: string;
        personAddress: data.IPersonAddress;

        static $inject = ["PersonAddressService", "dialogs", "$state", "$stateParams"];
        constructor(private personAddressService: data.IPersonAddressService,
            private dialog: ng.dialogservice.IDialogService,
            private state: ng.ui.IStateService, params: IParams) {
            this.personId = params.personId;
            this.addressId = params.addressId;
        }

        onClose = () => {
            this.state.go("reception.management.contactdetail", { personId: this.personId });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/contact-details/edit-address.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionFileManagementContactDetailAddressEdit", new Component());

}
