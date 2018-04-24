namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncObstetricExaminationDialog extends ng.IController {

    }

    class Controller implements IAncObstetricExaminationDialog {

        ancObstetricExaminationId: string;
        obstetricExamination: data.IAncObstetricExamination;

        static $inject = ["AncObstetricExaminationService"];
        constructor(private generalAssessmentService: data.IAncObstetricExaminationService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.ancObstetricExaminationId) {
                this.generalAssessmentService.get(this.ancObstetricExaminationId).then((response) => {
                    this.obstetricExamination = response;
                }, (error) => {
                });
            }

        }
        update = () => {
            this.generalAssessmentService.update(this.obstetricExamination).then((response) => {

            }, (error) => {
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc/obstetric_examination/obstetric_examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                ancObstetricExaminationId: "<"
            };

        }
    }

    app.component("mrsAncObstetricExaminationDialog", new Component());

}
