namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        workareaId: string;
        personId: string;
        ancObstetricExaminationId: string;

        static $inject = ["$state", "$stateParams", "AncModuleService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancModuleService: data.IAncModuleService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }
        $onInit = (): void => {
            if (this.personId) {
                this.ancModuleService.getAncSession(this.workareaId, this.personId).then((response) => {
                    this.ancObstetricExaminationId = response.obstetricExaminationId;
                }, (error) => {
                });
            }
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/obstrectic-examination/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncObstrecticExaminationListLayout", new Component());

}
