namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        ancGeneralAssessmentId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams", "AncModuleService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancModuleService: data.IAncModuleService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }
        $onInit = (): void => {
            if (this.personId) {
                this.ancModuleService.getAncSession(this.workareaId, this.personId).then((response) => {
                    this.ancGeneralAssessmentId = response.generalAssessmentId;
                }, (error) => {
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/general-assessment/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncGeneralAssessmentListLayout", new Component());

}
