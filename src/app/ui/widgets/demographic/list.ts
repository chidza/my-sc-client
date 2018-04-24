namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDemographicListDialog extends ng.IController {
        editPerson: (personId: Object) => void;
    }

    class Controller implements IDemographicListDialog {

        person = {} as data.IPerson;
        personId: string;
        personAge: number;
        personAddresses: Array<data.IPersonAddress> = [];
        public editPerson: (personId: Object) => void;

        educationlevels: Array<data.IEducationLevel> = [];
        occupations: Array<data.IOccupation> = [];
        maritalstates: Array<data.IMaritalState> = [];
        towns: Array<data.ITown> = [];

        static $inject = ["PersonService", "PersonAddressService", "EducationLevelService", "OccupationService", "MaritalStateService", "TownService"];
        constructor(private personService: data.IPersonService,
            private personAddressService: data.IPersonAddressService,
            private educationlevelService: data.IEducationLevelService,
            private occupationService: data.IOccupationService,
            private maritalStateService: data.IMaritalStateService,
            private townService: data.ITownService) {

        }

        $onInit = () => {
            this.personService.get(this.personId).then((response) => {
                this.person = response;
                console.log(this.person);
                this.personAge = this.personService.age(this.person);
            });

            this.personAddressService.getByPersonId(this.personId).then((response) => {
                this.personAddresses = response;
            });

            this.occupationService.query().then((response) => {
                this.occupations = response;
            });

            this.educationlevelService.query().then((response) => {
                this.educationlevels = response;
            });

            this.maritalStateService.query().then((response) => {
                this.maritalstates = response;
            });

            this.townService.query().then((response) => {
                this.towns = response;
            });

        }
        edit = (personId: string) => {
            this.editPerson({ personId: personId });
        }

        getMaritalState = (id: string) => {
            let value: any;
            this.maritalstates.forEach(function (state) {
                if (id === state.id) {
                    value = state.name;
                }
            });
            return value;
        }

        getLevel = (id: string) => {
            let value: any;
            this.educationlevels.forEach(function (level) {
                if (id === level.id) {
                    value = level.name;
                }
            });
            return value;
        }

        getOccupation = (id: string) => {
            let value: any;
            this.occupations.forEach(function (o) {
                if (id === o.id) {
                    value = o.name;
                }
            });
            return value;
        }
        getTown = (id: string) => {
            let value: any;
            this.towns.forEach(function (t) {
                if (id === t.id) {
                    value = t.name;
                }
            });
            return value;
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/demographic/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                editPerson: "&"
            };

        }
    }

    app.component("mrsDemographicList", new Component());

}
