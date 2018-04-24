namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        ancId: string;

        static $inject = ["dialogs", "$state", "$stateParams", "AncService"];
        constructor(private dialog: ng.dialogservice.IDialogService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private ancService: data.IAncService) {
            this.personId = params["personId"];
        }

        onEnrollment = () => {
            this.state.go("consultation.management.ancregistration.enrollment");
        }

        onSocialHistory = () => {
            this.ancService.current(this.personId).then((response) => {
                this.state.go("consultation.management.ancregistration.socialhistory", { ancId: response.id });
            }, (error) => {
                let dlg = this.dialog.confirm("ANC Registration", "Patient has no ANC record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.ancregistration.enrollment");
                });
            });

        }

        onMedicalHistory = () => {
            this.ancService.current(this.personId).then((response) => {
                this.state.go("consultation.management.ancregistration.medicalHistory", { ancId: response.id });
            }, (error) => {
                let dlg = this.dialog.confirm("ANC Registration", "Patient has no ANC record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.ancregistration.enrollment");
                });
            });
        }



        onInvestigationHistory = () => {
            this.ancService.current(this.personId).then((response) => {

                this.state.go("consultation.management.ancregistration.investigationHistory.list");
            }, (error) => {
                let dlg = this.dialog.confirm("ANC Registration", "Patient has no ANC record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.ancregistration.enrollment");
                });
            });
        }



        onVisitHistory = () => {
            this.ancService.current(this.personId).then((response) => {
                this.state.go("consultation.management.ancregistration.visitHistory.list", { ancId: response.id });
            }, (error) => {
                let dlg = this.dialog.confirm("ANC Registration", "Patient has no ANC record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.ancregistration.enrollment");
                });
            });
        }

        onPreviousPregnancy = () => {
            this.ancService.current(this.personId).then((response) => {
                this.state.go("consultation.management.ancregistration.previousPregnancies.list", { ancId: response.id });
            }, (error) => {
                let dlg = this.dialog.confirm("ANC Registration", "Patient has no ANC record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.ancregistration.enrollment");
                });
            });

        }

        onClose = () => {
            this.state.go("consultation.management.anc.overview");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/registration/menu.html",
            public controllerAs = "vm",
            public controller = Controller) {
        }
    }

    app.component("mrsConsultationPatientAncRegistrationMenuLayout", new Component());

}
