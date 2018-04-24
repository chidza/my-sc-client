namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientInitiation extends ng.IController {

    }

    class Controller implements IArtPatientInitiation {


        artId: string;
        personId: string;
        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
        }


        $onInit = (): void => {
            this.artService.getByPersonId(this.personId).then((response) => {
                this.artId = response.id;
            });
        }

        onChangeReason = (id: string) => {
            this.state.go("consultation.management.artRegistration.artInitiations.artInitiationReason", { personArtStatusId: id });
        }

        onChangeRegimen = (id: string) => {
            this.state.go("consultation.management.artRegistration.artInitiations.artInitiationRegimen", {personArtStatusId: id});
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/registration/initiation/initiation.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientArtInitiation", new Component());

}
