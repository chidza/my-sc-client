

namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHtsOverviewDialog extends ng.IController {
        closed: () => void;
        saved: () => void;
    }

    class Controller implements IHtsOverviewDialog {
        encounterId: string;
        personId: string;
        htsId: string;
        hts = {} as data.IHts;
        investigationResult: data.IInvestigation;
        reasonsForNotIssuingResult: Array<data.IReasonForNotIssuingResult>;
        personInvestigation: data.IPersonInvestigation;
        purposes: Array<data.IHtsPurposeOfTest>;
        reasons: Array<data.IHtsReasonForNotIssuingResult>;
        models: Array<data.IHtsModel>;

        public saved: () => void;

        public closed: () => void;

        static $inject = ["HtsService", "PersonInvestigationService", "HtsPurposeOfTestService", "HtsModelService", "HtsReasonForNotIssuingResultService","dialogs", "$uibModal"];
        constructor(
            private htsService: data.IHtsService,
            private personInvestigationService: data.IPersonInvestigationService,
            private purposeOfTestServiceService: data.IHtsPurposeOfTestService,
            private htsModelService: data.IHtsModelService,
            private reasonForNotIssuingResultService: data.IHtsReasonForNotIssuingResultService,private dialog: ng.dialogservice.IDialogService,
            private modal: ng.ui.bootstrap.IModalService) {
        }

        $onInit = () => {

            if (this.htsId) {
                this.htsService.get(this.htsId).then((response) => {
                    this.hts = response;

                    this.personInvestigationService.get(this.hts.investigationId).then((response) => {
                        this.personInvestigation = response;
                    });

                });
            }

            this.purposeOfTestServiceService.query("").then((response) => {
                this.purposes = response;
            });

            this.reasonForNotIssuingResultService.query("").then((response) => {
                this.reasons = response;
            });

            this.htsModelService.query("").then((response) => {
                this.models = response;
            });

        }

        purposeofTestName = (id: string): string => {
            let result = "";
            if (id) {

                if (this.purposes) {
                    this.purposes.forEach((purpose) => {
                        if (purpose.id === id) {
                            result = purpose.name;
                        }
                    });
                }


            }

            return result;
        }

        ReasonName = (id: string): string => {
            let result = "";
            if (id) {
                if (this.reasons) {
                    this.reasons.forEach((purpose) => {
                        if (purpose.id === id) {
                            result = purpose.name;
                        }
                    });
                }


            }

            return result;
        }

         checkDetails = () => {

      let dlg = this.dialog.notify("Reasons", "Please ensure that you put the reason for not issuing result in the next field");

      dlg.result.then((btn) => {

      }, (error) => {

      });

    }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/hts-overview/detail.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterId: "<",
                personId: "<",
                htsId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsHtsOverviewDetail", new Component());

}
