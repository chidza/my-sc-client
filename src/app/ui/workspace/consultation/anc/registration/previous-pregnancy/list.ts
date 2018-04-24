namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdPatientMedicationNew extends ng.IController {

    }

    class Controller implements ng.IController {

        personId: string;
        ancId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.personId = params["personId"];
            this.ancId = params["ancId"];
            console.log(params);
        }

        view = () => {

        }

        edit = (id: string) => {
            this.state.go("consultation.management.ancregistration.previousPregnancies.edit", { previousAncId: id });
        }

        add = () => {
            this.state.go("consultation.management.ancregistration.previousPregnancies.add");
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/previous-pregnancy/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientAncPreviousPregnanciesListLayout", new Component());

}
