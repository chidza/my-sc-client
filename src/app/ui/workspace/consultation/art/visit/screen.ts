namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtTbScreening extends ng.IController {

    }

    class Controller implements IArtTbScreening {

        $router: any;
        encounterId: string;
        personId: string;
        artVisitId: string;

        $routerOnActivate = (next: any): void => {
            this.encounterId = next.params.encounterId;
            this.personId = next.params.personId;
            this.artVisitId = next.params.artVisitId;
        }

        onClose = () => {
            this.$router.navigate(["ArtVisitExamination", { personId: this.personId, encounterId: this.encounterId, artVisitId: this.artVisitId }]);
        }

    }

    class Component implements ng.IComponentOptions {
        constructor(
            public templateUrl = "app/ui/workspace/consultation/art/visit/screen.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientArtVisitScreenLayout", new Component());

}
