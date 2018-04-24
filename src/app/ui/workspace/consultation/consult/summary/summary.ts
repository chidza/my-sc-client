namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workspaceId: string;
        workareaId: string;
        opdId: string;
        admissionId: string;
        hivStatus = {} as data.IHivStatus;
        result: String;

        static $inject = ["$state", "$stateParams", "OpdService", "AdmissionService", "ConsultationService", "dialogs", "PersonService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private opdService: data.IOpdService,
            private admissionService: data.IAdmissionService,
            private consultationService: data.IConsultationService,
            private dialog: ng.dialogservice.IDialogService,
            private personService: data.IPersonService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            console.log(params);
        }

        $onInit = (): void => {
            this.opdService.current(this.personId).then((response) => {
                this.opdId = response.id;
            });

            this.admissionService.current(this.personId).then((response) => {
                this.admissionId = response.id;
            });

            if (this.personId) {
                this.personService.hivStatus(this.personId, new Date()).then((response) => {
                    this.hivStatus = response;
                    console.log("inside code", this.hivStatus);
                    if (this.hivStatus.status.toLowerCase() === "positive") {
                        this.result = "1";
                    }
                    if (this.hivStatus.status.toLowerCase() === "negative") {
                        this.result = "0";
                    }
                    if (this.hivStatus.status.toLowerCase() === "unknown") {
                        this.result = "UNKNOWN";
                    }
                });
            }
        }

        hts = () => {
            let state = "consultation.management.hts.overview";
            let dlg = this.dialog.confirm("HTS Module", "Do you want to proceed to HTS Module?");
            dlg.result.then((btn) => {
                this.consultationService.htsEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                    this.state.go(state, {
                        workareaId: this.workareaId, personId: this.personId,
                        encounterId: response.encounterId, htsId: response.htsId
                    });
                });
            });

        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/consult/summary/summary.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientConsultSummaryLayout", new Component());

}
