namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        queueId: string;
        encounterId: string;
        artVisitId: string;
        opdId: string;
        artId: string;

        static $inject = ["$state", "$stateParams", "ArtService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private artService: data.IArtService) {
            this.personId = params["personId"];
        }

        onFamilyMembers = () => {
            this.state.go("consultation.management.artRegistration.familyMember.list", { artId: this.artId });
        }

        onExaminations = () => {
            this.state.go("consultation.management.artRegistration.examinations", { artId: this.artId });
        }
        onCurrentSymptoms = () => {
            this.state.go("consultation.management.artRegistration.currentSymptoms", { artId: this.artId });
        }
        onInitiation = () => {
            this.state.go("consultation.management.artRegistration.artInitiations.artInitiation", { artId: this.artId });
        }
        onPastMedicalHistory = () => {
            this.state.go("consultation.management.artRegistration.medicalHistory", { artId: this.artId });
        }
        onDrugHistory = () => {
            this.state.go("consultation.management.artRegistration.drugHistory.list", { artId: this.artId });
        }
        onInvestigationHistory = () => {
            this.state.go("consultation.management.artRegistration.investigationHistory.list", { artId: this.artId });
        }

        onClose = () => {
            this.state.go("consultation.management.art.overview", { artId: this.artId });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = " app/ui/workspace/consultation/art/registration/menu.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                $router: "<"
            };

        }
    }

    app.component("mrsConsultationPatientArtRegistrationMenuLayout", new Component());

}
