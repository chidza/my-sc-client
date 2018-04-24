namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtRegistrationMenu extends ng.IController {
        familyMembers: () => void;
        currentSymptoms: () => void;
        initiation: () => void;
        pastMedicalHistory: () => void;
        examinations: () => void;
        drugHistory: () => void;
        back: () => void;
        investigationHistory: () => void;
    }

    class Controller implements IArtRegistrationMenu {
        personId: string;

        public familyMembers: () => void;
        public currentSymptoms: () => void;
        public initiation: () => void;
        public pastMedicalHistory: () => void;
        public examinations: () => void;
        public drugHistory: () => void;
        public back: () => void;
        public investigationHistory: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/art/art-registration.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                familyMembers: "&",
                currentSymptoms: "&",
                initiation: "&",
                examinations: "&",
                pastMedicalHistory: "&",
                drugHistory: "&",
                back: "&",
                investigationHistory: "&"
            };

        }
    }

    app.component("mrsArtRegistrationMenu", new Component());

}
