namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHtsMenu extends ng.IController {
        overview: () => void;
        vitals: () => void;
        investigations: () => void;
        vaccinations: () => void;
        visit: () => void;
        treatment: () => void;
        cmam: () => void;
        signOff: () => void;
    }

    class Controller implements IHtsMenu {
        personId: string;
        public overview: () => void;
        public vitals: () => void;
        public investigations: () => void;
        public vaccinations: () => void;
        public visit: () => void;
        public treatment: () => void;
        public cmam: () => void;
        public signOff: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/imnci/imci.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                vitals: "&",
                investigations: "&",
                vaccinations: "&",
                visit: "&",
                treatment: "&",
                cmam: "&",
                signOff: "&"
            };

        }
    }

    app.component("mrsImnciMenu", new Component());

}
