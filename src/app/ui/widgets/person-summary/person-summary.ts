namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        model: data.IPerson;
        occupation: data.IOccupation;
        maritalState: data.IMaritalState;
        educationLevel: data.IEducationLevel;

        static $inject = ["PersonService", "MaritalStateService", "EducationLevelService", "OccupationService"];
        constructor(private personService: mrs.data.IPersonService,
            private maritalStateService: data.IMaritalStateService,
            private educationLevelService: data.IEducationLevelService,
            private occupationService: data.IOccupationService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.personId) {

                this.personService.get(this.personId).then((response) => {
                    this.model = response;
                    if (this.model.educationLevelId) {
                        this.educationLevelService.get(this.model.educationLevelId).then((response) => {
                            this.educationLevel = response;
                        });
                    }

                    if (this.model.maritalStateId) {
                        this.maritalStateService.get(this.model.maritalStateId).then((response) => {
                            this.maritalState = response;
                        });
                    }

                    if (this.model.occupationId) {
                        this.occupationService.get(this.model.occupationId).then((response) => {
                            this.occupation = response;
                        });
                    }
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
            public templateUrl = "app/ui/widgets/person-summary/person-summary.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<"
            };
        }
    }

    app.component("mrsPersonSummary", new Component());

} 