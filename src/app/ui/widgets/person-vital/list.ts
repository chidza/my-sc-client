namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonInvestigationList extends ng.IController {
        adding: () => void;
        editing: (personVitalId: Object) => void;
    }

    class Controller implements IPersonInvestigationList {
        personId: string;
        refresh: number;
        date: string;
        vitals: Array<data.IEncounterVitalList> = [];
        public adding: () => void;
        public editing: (personVitalId: Object) => void;

        static $inject = ["PersonVitalService", "dialogs"];
        constructor(private personVitalService: data.IPersonVitalService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {
            if (this.personId && this.date) {
                this.personVitalService.getByPersonId(this.personId, this.date).then((response) => {
                    this.vitals = response;
                });
            }
        }

        add = () => {
            this.adding();
        }

        edit = (id: string) => {
            this.editing({ personVitalId: id });
        }

        delete = (id: string) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.personVitalService.remove(id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-vital/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editing: "&",
                adding: "&",
                personId: "<",
                refresh: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPersonVitalList", new Component());

}
