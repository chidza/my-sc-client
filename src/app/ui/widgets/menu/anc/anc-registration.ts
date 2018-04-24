namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncRegistrationMenu extends ng.IController {
        enrollment: () => void;
        socialHistory: () => void;
        medicalHistory: () => void;
        previousPregnancy: () => void;
        visitHistory: () => void;
        investigationHistory: () => void;
        close: () => void;

    }

    class Controller implements IAncRegistrationMenu {
        personId: string;
        public visitHistory: () => void;
        public enrollment: () => void;
        public socialHistory: () => void;
        public medicalHistory: () => void;
        public previousPregnancy: () => void;
        public investigationHistory: () => void;
        public close: () => void;

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/anc/anc-registration.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                enrollment: "&",
                socialHistory: "&",
                visitHistory: "&",
                medicalHistory: "&",
                previousPregnancy: "&",
                close: "&",
                drugHistory: "&",
                back: "&",
                investigationHistory: "&"
            };

        }
    }

    app.component("mrsAncRegistrationMenu", new Component());

}
