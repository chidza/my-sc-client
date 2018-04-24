namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHivStatusDialog extends ng.IController {
        offerHts: () => void;
    }

    class Controller implements IHivStatusDialog {
        personId: string;
        date: Date;
        hivStatus = {} as data.IHivStatus;
        public offerHts: () => void;


        static $inject = ["PersonService"];
        constructor(private personService: data.IPersonService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            this.personService.hivStatus(this.personId, this.date).then((reponse) => {
                this.hivStatus = reponse;
                if (this.hivStatus.status === "POSITIVE") {
                    this.hivStatus.status = "1";
                }
                if (this.hivStatus.status === "NEGATIVE") {
                    this.hivStatus.status = "0";
                }
            });

        }
        gotoHts = () => {
            this.offerHts();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/hiv-status/hiv-status.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                date: "<",
                offerHts: "&"
            };

        }
    }

    app.component("mrsHivStatusDialog", new Component());

}
