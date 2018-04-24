namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonRelationList extends ng.IController {
        addRelation: () => void;
        editRelation: (personRelationId: Object) => void;
    }

    class Controller implements IPersonRelationList {

        public addRelation: () => void;
        public editRelation: (personRelationId: Object) => void;
        personId: string;
        relations: Array<data.IRelationList> = [];

        static $inject = ["RelationService", "dialogs"];
        constructor(private relationService: data.IRelationService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        init = () => {
            this.relationService.fetch(this.personId).then((response) => {
                this.relations = response;
            });
        }


        $onInit = () => {
            this.init();
        }

        add = () => {
            this.addRelation();
        }

        edit = (id: String) => {
            this.editRelation({ personRelationId: id });
        }
        remove = (id: string) => {

            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.relationService.remove(id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-relation/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                addRelation: "&",
                editRelation: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsPersonRelationList", new Component());

}
