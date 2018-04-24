namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;

        model: data.IPerson;

        static $inject = ["PersonService"];
        constructor(private personService: mrs.data.IPersonService) {
        }

        $onChanges = (): void => {
            if ((this.personId) && (this.personId)) {

                this.personService.get(this.personId).then((response) => {
                    this.model = response;
                }, () => {
                    this.model = null;
                });

            } else {
                this.model = null;
            }
        }

        age = (): number => {
            if (this.model != null)
                return this.personService.age(this.model);
            else
                return 0;
        }

    }

    class Component implements ng.IComponentOptions {
        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/widgets/person-label/person-label.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "personId": "<"
            };
        }
    }

    app.component("mrsPersonLabel", new Component());

}