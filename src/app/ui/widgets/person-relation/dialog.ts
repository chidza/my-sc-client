namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonRelationDialog extends ng.IController {
        saved: () => void;
        closed: () => void;
        changeMember: () => void;
    }

    class Controller implements IPersonRelationDialog {

        public saved: () => void;
        public closed: () => void;
        public changeMember: () => void;
        personId: string;
        memberId: string;
        personRelationId: string;
        personRelation = {} as data.IRelation;
        relationshipTypes: Array<data.IRelationShipTypes> = [];

        static $inject = ["RelationShipTypesService", "dialogs", "RelationService"];
        constructor(private relationShipTypesService: data.IRelationShipTypesService,
            private dialog: ng.dialogservice.IDialogService,
            private relationService: data.IRelationService) {

        }

        init = () => {
            if (this.memberId) {
                this.relationShipTypesService.query().then((response) => {
                    this.relationshipTypes = response;
                });
                this.relationService.get(this.personRelationId).then((response) => {
                    this.personRelation = response;
                }, (error) => {
                    this.personRelation.personId = this.personId;
                    this.personRelation.memberId = this.memberId;
                });
            }
        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        close = () => {
            this.closed();
        }

        save = (id: String) => {
            if (this.personRelation.id) {
                this.relationService.update(this.personRelation).then((response) => {
                    this.saved();
                });
            } else {
                this.relationService.save(this.personRelation).then((response) => {
                    this.saved();
                });
            }

        }
        change = () => {
            this.changeMember();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-relation/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "closed": "&",
                "saved": "&",
                "changeMember": "&",
                "personId": "<",
                "memberId": "<",
                "personRelationId": "<"
            };

        }
    }

    app.component("mrsPersonRelationDialog", new Component());

}
