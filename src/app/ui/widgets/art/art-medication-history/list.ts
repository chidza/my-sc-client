namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonMedicationList extends ng.IController {

        addMedication: () => void;
        editMedication: (medicationId: Object) => void;
    }

    class Controller implements IPersonMedicationList {

        medicationList = [] as Array<data.IArtMedicationHistoryList>;
        artId: string;

        public addMedication: () => void;
        public editMedication: (personMedicationId: Object) => void;



        static $inject = ["ArtMedicationHistoryService", "dialogs"];
        constructor(private artMedicationHistoryService: data.IArtMedicationHistoryService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.artId) {
                console.log("this.artId");
                console.log(this.artId);
                this.artMedicationHistoryService.getByArtId(this.artId).then((response) => {
                    this.medicationList = response;
                });
            }
        }

        add = () => {
            this.addMedication();
        }

        delete = (item: data.IArtMedicationHistoryList) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.artMedicationHistoryService.remove(item.id).then((response) => {
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
            public templateUrl = "app/ui/widgets/art/art-medication-history/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "addMedication": "&",
                "editMedication": "&",
                artId: "<"
            };

        }
    }

    app.component("mrsArtMedicationHistoryList", new Component());

}
