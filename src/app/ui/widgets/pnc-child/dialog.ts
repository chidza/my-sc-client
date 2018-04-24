namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncChildDialog extends ng.IController {

    }

    class Controller implements IPncChildDialog {
        pncId: string;
        pnc: data.IPnc;
        pncSelected: any;
        relationSelected: any;
        children: Array<Object> = [];
        pncChildren: Array<Object> = [{ id: 1, name: "Willashe", sex: "Male", age: 2 }, { id: 2, name: "Sandra Bullock", sex: "Female", age: 3 }];
        static $inject = ["PncService", "dialogs"];
        constructor(private pncService: mrs.data.IPncService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onInit = (): void => {
            this.pncService.get(this.pncId).then((response) => {
                this.pnc = response;
            });


        }


        add = () => {
            /* this.pncService.update(this.pnc).then((response) => {
                 this.dialog.notify("", "Changes saved!");
             });*/
            if (this.relationSelected) {
                if (this.pncChildren.indexOf(this.relationSelected) < 0) {
                    this.pncChildren.push(this.relationSelected);
                    this.children.splice(this.children.indexOf(this.relationSelected), 1);
                } else {
                    this.dialog.notify("", "Nothing to remove!");
                }
            } else {
                this.dialog.notify("", "Nothing selected!");
            }
        }

        remove = () => {
            /* this.pncService.update(this.pnc).then((response) => {
                 this.dialog.notify("", "Changes saved!");
             });*/
            if (this.pncSelected) {
                if (this.children.indexOf(this.pncSelected) < 0) {
                    this.children.push(this.pncSelected);
                    this.pncChildren.splice(this.pncChildren.indexOf(this.pncSelected), 1);
                } else {
                    this.dialog.notify("", "Nothing to remove!");
                }
            } else {
                this.dialog.notify("", "Nothing selected!");
            }
        }

        selected = (array: String, child: any) => {
            if (array === "PNC") {
                this.pncSelected = child;
            }

            if (array === "Relation") {
                this.relationSelected = child;
            }
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/pnc-child/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                pncId: "<"
            };

        }
    }

    app.component("mrsPncChildDialog", new Component());

}
