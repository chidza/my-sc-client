namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncInformation extends ng.IController {

    }

    class Controller implements IAncInformation {

        personId: string;
        ancInformation = {} as data.IInformation;
        hivStatus: data.IHivStatus;

        static $inject = ["AncService", "PersonService"];
        constructor(private ancService: data.IAncService,
            private personService: data.IPersonService
        ) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.ancService.getInformation(this.personId).then((response) => {
                    this.ancInformation = response;
                });

                this.personService.hivStatus(this.personId, new Date()).then((reponse) => {
                    this.hivStatus = reponse;
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc/anc-information/anc-information.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<"

            };

        }
    }

    app.component("mrsAncInformation", new Component());

}
