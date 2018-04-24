namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonMedicationList extends ng.IController {

    }

    class Controller implements IPersonMedicationList {
        medicationList = [] as Array<data.IPersonMedicationHistoryList>;
        personId: string;
        refresh: number;
        date: string;
        public addMedication: () => void;
        public editMedication: (personMedicationId: Object) => void;



        static $inject = ["PersonMedicationService", "dialogs"];
        constructor(private personMedicationService: data.IPersonMedicationService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.personMedicationService.getByPersonId(this.personId, this.date).then((response) => {
                    this.medicationList = response;
                });
            }
        }

        add = () => {
            this.addMedication();
        }

        delete = (item: data.IPersonMedicationHistoryList) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.personMedicationService.remove(item.personMedicationId).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

        edit = (item: data.IPersonMedicationHistoryList) => {
            this.editMedication({ personMedicationId: item.personMedicationId });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-medication/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                addMedication: "&",
                editMedication: "&",
                personId: "<",
                refresh: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPersonMedicationList", new Component());

}
