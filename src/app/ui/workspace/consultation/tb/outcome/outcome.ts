namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        tbId: string;
        encounterId: string;

        static $inject = ["$state", "$stateParams", "TbService", "dialogs"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private tbService: data.ITbService,
            private dialog: ng.dialogservice.IDialogService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }


        $onInit = () => {
            this.tbService.current(this.personId).then((response) => {
                this.tbId = response.id;
            }, () => {
                let dlg = this.dialog.error("Tb Alert", " Patient does not have an active TB record! Please register the patient.");
                dlg.result.then((btn) => {
                    this.state.go("consultation.management.tb.overview");
                });
            });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/tb/outcome/outcome.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientTbOutcomeLayout", new Component());

}