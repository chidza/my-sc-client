namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        anc = {} as data.IAnc;
        registeredStatus: boolean;

        static $inject = ["dialogs", "$state", "$stateParams", "AncModuleService"];
        constructor(private dialog: ng.dialogservice.IDialogService, private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private ancModuleService: data.IAncModuleService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }
        $onInit = (): void => {
            if (this.personId) {
                this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                    this.anc = response;
                });
            }
        }

        checkRegistration = () => {
            if (!this.anc.id) {
                let dlg = this.dialog.confirm("ANC Registration", "Patient has no ANC record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.ancregistration.enrollment");
                });
            }
        }

        onOverview = () => {
            this.state.go("consultation.management.anc.overview");
        }

        onRegistration = () => {
            this.state.go("consultation.management.ancregistration.enrollment");
        }

        onVitals = () => {
            this.checkRegistration();
            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.state.go("consultation.management.anc.vitals.list");
            });
        }

        onGeneralAssessment = () => {
            this.checkRegistration();
            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.state.go("consultation.management.anc.generalAssessment.list");
            });
        }

        onObestestricExamination = () => {
            this.checkRegistration();
            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.state.go("consultation.management.anc.obstrecticExamination.list");
            });
        }

        onInvestigation = () => {
            this.checkRegistration();
            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.state.go("consultation.management.anc.investigations.list");
            });
        }

        onMedicines = () => {
            this.checkRegistration();
            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.state.go("consultation.management.anc.medicines.list");
            });
        }

        onHealthEducation = () => {
            this.checkRegistration();
            this.ancModuleService.getCurrentAnc(this.personId).then((response) => {
                this.state.go("consultation.management.anc.education.list");
            });
        }

        onClose = () => {
            this.state.go("consultation.purpose.list", { workareaId: this.workareaId, personId: this.personId });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/anc/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientAncMenuLayout", new Component());

}
