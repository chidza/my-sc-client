namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncMenu extends ng.IController {
        overview: () => void;
        registration: () => void;
        vitals: () => void;
        examinations: () => void;
        medicines: () => void;
        education: () => void;
        signoff: () => void;
    }

    class Controller implements IPncMenu {
        personId: string;

        public overview: () => void;
        public registration: () => void;
        public vitals: () => void;
        public examinations: () => void;
        public medicines: () => void;
        public education: () => void;
        public signoff: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/pnc/pnc.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                registration: "&",
                vitals: "&",
                examinations: "&",
                medicines: "&",
                education: "&",
                signoff: "&"
            };

        }
    }

    app.component("mrsPncMenu", new Component());

}
