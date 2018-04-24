namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ICervixList extends ng.IController {
        editCervix: (cervixId: Object) => void;
        addCervix: () => void;
    }

    class Controller implements ICervixList {
        public editCervix: (cervixId: Object) => void;
        public addCervix: () => void;
        deliveryId: string;
        cervices: Array<data.ICervix> = [];
        section: string;
        levels: Array<data.ILevelOfPresentingPart> = [];
        static $inject = ["CervixService", "dialogs", "LevelOfPresentingPartService"];
        constructor(private cervixService: data.ICervixService,
            private dialog: ng.dialogservice.IDialogService,
            private levelService: data.ILevelOfPresentingPartService) { }

        $onInit = () => {

            if (this.deliveryId) {
                this.cervixService.fetch(this.deliveryId).then((response) => {
                    this.cervices = response;
                });
            }

            this.levelService.query().then((response) => {
                this.levels = response;
            });
        }


        edit = (item: data.ICervix) => {
            this.editCervix({ cervixId: item.id });
        }

        remove = (item: data.ICervix) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.cervixService.remove(item.id).then((response) => {
                    this.cervices.splice(this.cervices.indexOf(item), 1);
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addCervix();
        }
        getDescent = (id: string): String => {
            let result: String = "";
            if (this.levels) {
                this.levels.forEach((level) => {
                    if (level.id === id) {
                        result = level.name;
                    }
                });
            }
            return result;

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/cervix/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editCervix: "&",
                addCervix: "&",
                deliveryId: "<",
                section: "@"
            };

        }
    }

    app.component("mrsCervixList", new Component());

}
