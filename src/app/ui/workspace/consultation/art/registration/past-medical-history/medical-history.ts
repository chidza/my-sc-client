namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    
    class Controller implements ng.IController {

      artId: string;
        personId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
        }
        $onInit = () => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        /*add = () => {
            this.$router.navigate(["ArtPatientDetail", { encounterId: 20 }]);
        }*/
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/past-medical-history/medical-history.html",
           public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtMedicalHistory", new Component());

}
