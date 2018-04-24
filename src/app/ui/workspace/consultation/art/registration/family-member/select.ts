namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientFamilyMember extends ng.IController {

    }

    class Controller implements IArtPatientFamilyMember {

        $router: any;
        personId: string;
        artId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
                this.personId = params["personId"];
        }

        onSelect = (id: string) => {
            this.state.go("consultation.management.artRegistration.familyMember.add", { memberId: id });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/family-member/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtFamilyMemberSelectLayout", new Component());

}
