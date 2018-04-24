namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncGeneralAssessmentDialog extends ng.IController {

    }

    class Controller implements IAncGeneralAssessmentDialog {
        personId: string;
        encounterId: string;
        ancGeneralAssessmentId: string;
        generalAssessment: data.IAncGeneralAssessment;
        stage: string;

        static $inject = ["AncGeneralAssessmentService", "PersonExaminationService", "OpdService"];
        constructor(private generalAssessmentService: data.IAncGeneralAssessmentService,
            private personExaminationService: data.IPersonExaminationService,
            private opdService: data.IOpdService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.ancGeneralAssessmentId) {
                this.generalAssessmentService.get(this.ancGeneralAssessmentId).then((response) => {
                    this.generalAssessment = response;
                    this.checkTbStatus();
                }, (error) => {
                });
            }

        }

        checkTbStatus = () => {
            this.opdService.current(this.personId).then((response) => {
                this.personExaminationService.getOpdTbStatus(response.id).then((response) => {
                    if (response.status === "No" || response.status === "On treatment") {
                        this.generalAssessment.tbScreeningDone = false;
                    } else {
                        this.generalAssessment.tbScreeningDone = true;
                    }
                    this.update();
                });
            });
        }
        update = () => {
            this.generalAssessmentService.update(this.generalAssessment).then((response) => {
                this.generalAssessment = response;
            }, (error) => {
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc/general_assessment/general_assessment.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                ancGeneralAssessmentId: "<",
                personId: "<",
                encounterId: "<",
                stage: "@"
            };

        }
    }

    app.component("mrsAncGeneralAssessmentDialog", new Component());

}
