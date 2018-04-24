namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVaginalMonitoringDialog extends ng.IController {
        closed: () => void;
    }

    class Controller implements IVaginalMonitoringDialog {
        user: string;
        date: string;
        deliveryId: string;
        personId: string;
        encounterId: string;
        essentialCareForBabiesId: string;
        workspaceId: string;
        public closed: () => void;

        static $inject = ["$state", "$stateParams", "DeliveryService", "Principal", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private Principal: security.IPrincipal,
            private dialog: ng.dialogservice.IDialogService) {

            this.personId = params["personId"];
            //   this.essentialBabyCareId = params["essentialCareForBabiesId"];
            this.workspaceId = params["workspaceId"];




        }

        confirm = () => {

            let dlg = this.dialog.confirm("Confirm", "Are you sure you want to close this ESB Recording "
                + "?");

            dlg.result.then(() => {
                this.state.go("consultation.management.essentialCareForBabies.overview");
            });
        }



        $onInit = () => {
            console.log("in dialog parent form" + this.essentialCareForBabiesId);
            this.Principal.identity().then((response) => {
                this.user = response.lastName + " " + response.firstName;
            });
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/essential-care-for-babies-form-parent/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                date: "@",
                deliveryId: "<",
                encounterId: "<",
                closed: "&",
                essentialCareForBabiesId: "<"
            };

        }
    }

    app.component("mrsEssentialCareForBabiesFormParentFormDialog", new Component());

}
