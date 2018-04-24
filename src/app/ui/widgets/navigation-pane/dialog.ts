
namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface INavigationPaneDialog extends ng.IController {

        saved: () => void;
        closed: () => void;

    }

    class Controller implements INavigationPaneDialog {


        public saved: () => void;
        public closed: () => void;
        componentType: string;
        title: string;
        childtitle: string;
        componetChildTypeLabel: string;

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.getComponentTitle();
            this.getComponentTitleChild();
        }
// TODO: Implement wiring of this component

        getComponentTitle = () => {
            if (this.componetChildTypeLabel) {
                this.title = this.componentType.replace("mrs", " ");
            }
        }

        getComponentTitleChild = () => {
            if (this.componetChildTypeLabel) {
                this.childtitle = this.componetChildTypeLabel;
            }
        }




    }
    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/navigation-pane/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "saved": "&",
                "closed": "&",
                "componentType": "<",
                "componetChildTypeLabel": "<"
            };

        }
    }

    app.component("mrsNavigationPaneDialog", new Component());

}
