namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterMenu extends ng.IController {
        overview: () => void;
        vitals: () => void;
        complaints: () => void;
        examinations: () => void;
        investigations: () => void;
        diagnoses: () => void;
        medicines: () => void;
        procedures: () => void;
        signoff: () => void;
    }

    class Controller implements IEncounterMenu {
        personId: string;

        public overview: () => void;
        public vitals: () => void;
        public complaints: () => void;
        public examinations: () => void;
        public investigations: () => void;
        public diagnoses: () => void;
        public medicines: () => void;
        public procedures: () => void;
        public signoff: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/encounter/encounter.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                vitals: "&",
                complaints: "&",
                examinations: "&",
                investigations: "&",
                diagnoses: "&",
                medicines: "&",
                procedures: "&",
                signoff: "&"
            };

        }
    }

    app.component("mrsEncounterMenu", new Component());

}
