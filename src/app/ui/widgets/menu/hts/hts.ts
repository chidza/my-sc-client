namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHtsMenu extends ng.IController {
        overview: () => void;
        pretest: () => void;
        testing: () => void;
        posttest: () => void;
        signoff: () => void;
    }

    class Controller implements IHtsMenu {
        personId: string;

        public overview: () => void;
        public pretest: () => void;
        public testing: () => void;
        public posttest: () => void;
        public signoff: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/hts/hts.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                overview: "&",
                pretest: "&",
                testing: "&",
                posttest: "&",
                signoff: "&"
            };

        }
    }

    app.component("mrsHtsMenu", new Component());

}
