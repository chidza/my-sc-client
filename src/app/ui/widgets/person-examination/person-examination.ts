namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonExaminationDialog extends ng.IController {

    }

    class Controller implements IPersonExaminationDialog {

        personExamination: data.IPersonExamination;
        datePickerOpenStatus = {};
        examinationId: string;
        personId: string;
        examination: data.IExamination;

        static $inject = ["PersonExaminationService", "ExaminationService"];
        constructor(private personExaminationService: data.IPersonExaminationService,
            private examinationService: data.IExaminationService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
        }

        $onInit = () => {
            if (this.examinationId) {
                this.examinationService.get(this.examinationId).then((response) => {
                    this.examination = response;

                });
            }
        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            this.personExamination.examinationId = this.examinationId;
            this.personExamination.personId = this.personId;

            this.personExaminationService.save(this.personExamination).then((response) => {
                console.log("saving");
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-examination/person-examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                examinationId: "<"
            };

        }
    }

    app.component("mrsPersonExaminationDialog", new Component());

}
