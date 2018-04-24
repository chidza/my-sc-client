namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonDiagnosisDialog extends ng.IController {

    }

    class Controller implements IPersonDiagnosisDialog {

        personDiagnosis: data.IPersonDiagnosis;
        datePickerOpenStatus = {};
        diagnosisId: string;
        personId: string;
        diagnosis: data.IDiagnosis;

        static $inject = ["PersonDiagnosisService", "DiagnosisService"];
        constructor(private personDiagnosisService: data.IPersonDiagnosisService,
            private diagnosisService: data.IDiagnosisService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
        }

        $onInit = () => {
            if (this.diagnosisId) {
                this.diagnosisService.get(this.diagnosisId).then((response) => {
                    this.diagnosis = response;

                });
            }
        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            this.personDiagnosis.diagnosisId = this.diagnosisId;
            this.personDiagnosis.personId = this.personId;

            this.personDiagnosisService.save(this.personDiagnosis).then((response) => {
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-diagnosis/person-diagnosis.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                diagnosisId: "<"
            };

        }
    }

    app.component("mrsPersonDiagnosisDialog", new Component());

}
