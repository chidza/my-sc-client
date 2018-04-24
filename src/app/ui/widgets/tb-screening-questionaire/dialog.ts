namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ITbScreeningDialog extends ng.IController {
        closed: () => void;
        saved: () => void;
        selectDiagnosis: (diagnosisId: Object) => void;

    }

    class Controller implements ITbScreeningDialog {
        encounterId: string;
        personId: string;
        categoryName: string;
        tbExaminationsList: Array<data.IEncounterExaminationList>;
        personExamination = {} as data.IPersonExamination;
        personExaminationList: Array<data.IPersonExamination>;
        personEncounterExamination = {} as data.IEncounterExamination;
        encounterExaminationList: Array<data.IEncounterExaminationList>;
        public selectDiagnosis: (diagnosisId: Object) => void;

        public saved: () => void;
        public closed: () => void;


        static $inject = ["PersonExaminationService", "EncounterExaminationService"];
        constructor(
            private personExaminationService: data.IPersonExaminationService,
            private encounterExaminationService: data.IEncounterExaminationService) {

        }

        $onInit = () => {
            this.refresh();
        }

        selected = (row: any) => {
            this.selectDiagnosis({ id: row.id });
        }



        refresh = () => {
            this.encounterExaminationService.getTbScreeningByEncounterId(this.encounterId).then((response) => {
                this.encounterExaminationList = response;


            });

        }





        close = () => {
            this.closed();
        }

        update = (question: data.IPersonExamination, present: boolean) => {
            this.personExaminationService.get(question.id).then((response) => {
                response.present = present;
                this.personExaminationService.update(response).then(() => {
                });
            });
        }



        onSave = (promise: ng.IPromise<data.IEncounterExamination>) => {
            promise.then((response) => {
                if (this.saved !== null) {
                    this.saved();
                }
            }, () => {

            });
        }




    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/tb-screening-questionaire/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                tbId: "<",
                saved: "&",
                closed: "&",
                personId: "<",
                encounterId: "<",
                categoryName: "@",
                "selectDiagnosis": "&"
            };

        }
    }

    app.component("mrsTbScreeningDialog", new Component());

}