namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtMenu extends ng.IController {
        overview: () => void;
        registration: () => void;
        vitals: () => void;
        investigations: () => void;
        examinations: () => void;
        medicines: () => void;
        artStatus: () => void;
        iptStatus: () => void;
        signoff: () => void;
        newOi: () => void;
    }

    class Controller implements IArtMenu {
        personId: string;

        public overview: () => void;
        public registration: () => void;
        public vitals: () => void;
        public investigations: () => void;
        public examinations: () => void;
        public medicines: () => void;
        public artStatus: () => void;
        public iptStatus: () => void;
        public signoff: () => void;
        public newOi: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/art/art.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                registration: "&",
                vitals: "&",
                examinations: "&",
                investigations: "&",
                medicines: "&",
                artStatus: "&",
                iptStatus: "&",
                signoff: "&",
                newOi: "&"
            };

        }
    }

    app.component("mrsArtMenu", new Component());

}
