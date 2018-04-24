namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonEducationList extends ng.IController {
        adding: () => void;
        editing: (personHealthEducationId: Object) => void;
    }

    class Controller implements IPersonEducationList {
        personId: string;
        refresh: number;
        date: string;
        educations: Array<data.IPersonHealthEducationList> = [];
        public adding: () => void;
        public editing: (personHealthEducationId: Object) => void;

        static $inject = ["PersonHealthEducationService", "dialogs"];
        constructor(private personHealthEducationService: data.IPersonHealthEducationService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {
            if (this.personId && this.date) {
                this.personHealthEducationService.getByPersonId(this.personId, this.date).then((response) => {
                    console.log(response);
                    this.educations = response;
                });
            }
        }

        add = () => {
            this.adding();
        }

        edit = (id: string) => {
            this.editing({ personHealthEducationId: id });
        }

        delete = (item: data.IPersonHealthEducationList) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.personHealthEducationService.remove(item.id).then((response) => {
                    this.educations.splice(this.educations.indexOf(item), 1);
                });
            }, (error) => {

            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-health-education/list.html",
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

    app.component("mrsPersonHealthEducationList", new Component());

}
