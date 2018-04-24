namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientFamilyMemberAdd extends ng.IController {

    }

    class Controller implements IArtPatientFamilyMemberAdd {

        $router: any;
        personId: string;
        artId: string;
        memberId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
            this.memberId = params["memberId"];
        }


        onChange = (id: string) => {
            this.state.go("consultation.management.artRegistration.familyMember.select", { artId: this.artId });
        }

        onClose = (id: string) => {
            this.state.go("consultation.management.artRegistration.familyMember.list");

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/family-member/add.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtFamilyMemberAddLayout", new Component());

}
