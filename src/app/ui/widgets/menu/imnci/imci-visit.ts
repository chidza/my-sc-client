namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHtsMenu extends ng.IController {
        dangerSigns: () => void;
        cough: () => void;
        diarrhoea: () => void;
        fever: () => void;
        ear: () => void;
        nutrition: () => void;
        feeding: () => void;
        hiv: () => void;
        immunisation: () => void;
        finalDiagnosis: () => void;
        exit: () => void;
    }

    class Controller implements IHtsMenu {
        personId: string;
        public dangerSigns: () => void;
        public cough: () => void;
        public diarrhoea: () => void;
        public fever: () => void;
        public ear: () => void;
        public nutrition: () => void;
        public feeding: () => void;
        public hiv: () => void;
        public immunisation: () => void;
        public finalDiagnosis: () => void;
        public exit: () => void;
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/imnci/imci-visit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                dangerSigns: "&",
                cough: "&",
                diarrhoea: "&",
                fever: "&",
                ear: "&",
                nutrition: "&",
                feeding: "&",
                hiv: "&",
                immunisation: "&",
                finalDiagnosis: "&",
                exit: "&"
            };

        }
    }

    app.component("mrsImnciVisitMenu", new Component());

}
