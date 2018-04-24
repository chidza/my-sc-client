namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workspaceId: string;
        workareaId: string;
        opdId: string;
        admissionId: string;
        essentialCareForBabiesId: string;

        static $inject = ["$state", "$stateParams", "OpdService", "AdmissionService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private opdService: data.IOpdService,
            private admissionService: data.IAdmissionService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.essentialCareForBabiesId = params["essentialCareForBabiesId"];
            console.log(params);
        }

        $onInit = (): void => {
            this.opdService.current(this.personId).then((response) => {
                this.opdId = response.id;
            });

            this.admissionService.current(this.personId).then((response) => {
                this.admissionId = response.id;
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/overview/summary.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientEssentialCareForBabiesOverviewpLayoutp", new Component());

}
