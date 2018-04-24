namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncMenu extends ng.IController {
        overview: () => void;
        registration: () => void;
        vitals: () => void;
        generalAssessment: () => void;
       obestetricExamination: () => void;
        investigations: () => void;
        medicines: () => void;
        healthEducation: () => void;
        signoff: () => void;
    }

    class Controller implements IAncMenu {
        personId: string;

        public overview: () => void;
        public registration: () => void;
        public vitals: () => void;
        public generalAssessment: () => void;
        public obestetricExamination: () => void;
        public investigations: () => void;
        public medicines: () => void;
        public healthEducation: () => void;
        public  signoff: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/anc/anc.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                registration: "&",
                vitals: "&",
                generalAssessment: "&",
               obestetricExamination: "&",
                investigations: "&",
                medicines: "&",
                healthEducation: "&",
                signoff: "&"
            };

        }
    }

    app.component("mrsAncMenu", new Component());

}
