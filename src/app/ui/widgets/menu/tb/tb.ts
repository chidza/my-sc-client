namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ITbMenu extends ng.IController {
        overview: () => void;
        registration: () => void;
        vitals: () => void;
        investigations: () => void;
        examinations: () => void;
        medicines: () => void;
        education: () => void;
        outcome: () => void;
        signoff: () => void;
    }

    class Controller implements ITbMenu {
        personId: string;

        public overview: () => void;
        public registration: () => void;
        public vitals: () => void;
        public investigations: () => void;
        public examinations: () => void;
        public medicines: () => void;
        public education: () => void;
        public outcome: () => void;
        public signoff: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/tb/tb.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                registration:"&",
                vitals: "&",
                examinations: "&",
                medicines: "&",
                education: "&",
                outcome: "&",
                signoff: "&"
            };

        }
    }

    app.component("mrsTbMenu", new Component());

}
