namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        workareaId: string;
        personId: string;
        artId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }
        /*$onInit = (): void => {
            if (this.personId) {
                this.ancModuleService.getAncSession(this.workareaId, this.personId).then((response) => {
                    this.ancObstetricExaminationId = response.obstetricExaminationId;
                }, (error) => {
                });
            }
        }*/

        onAddMember = () => {
            this.state.go("consultation.management.artRegistration.familyMember.select");
     }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/family-member/list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientArtFamilyMemberListLayout", new Component());

}
