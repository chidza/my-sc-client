namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        ancId: string;

        static $inject = ["$state", "$stateParams", "AncService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancService: data.IAncService) {
            this.personId = params["personId"];
        }

        $onInit = () => {
            this.ancService.current(this.personId).then((response) => {
                this.ancId = response.id;
            }, () => {
                this.state.go("consultation.management.ancregistration.ancEdit");
            });
        }

        onEdit = () => {
            this.state.go("consultation.management.ancregistration.ancEdit");
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/enrollment/list.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientAncEnrollmentLayout", new Component());

}
