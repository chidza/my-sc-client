namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramDrugView extends ng.IController {

    }

    class Controller implements IPartogramDrugView {
        medicationList: Array<data.IPartogramDrugList> = [];
        personId: string;
        encounterId: string;
        date: string;
        refreshMedication: number = 1;


        static $inject = ["PersonMedicationService", "dialogs", "DispenseService", "$uibModal"];
        constructor(private personMedicationService: data.IPersonMedicationService,
            private dialog: ng.dialogservice.IDialogService,
            private dispenseService: data.IDispenseService,
            private modal: ng.ui.bootstrap.IModalService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId && this.date) {
                this.dispenseService.getByPersonIdAndDate(this.personId, this.date).then((response) => {
                    this.medicationList = response;
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/drugs/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPartogramDrugViewStatic", new Component());

}
