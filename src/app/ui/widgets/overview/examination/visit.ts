namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {
        opdId: string;
        admissionId: string;
        reload: number;

        examinations: Array<data.IEncounterExaminationList> = [];

        static $inject = ["PersonExaminationService"];
        constructor(private personExaminationService: data.IPersonExaminationService) {

        }


        init = () => {
            console.log(this.reload);
            if (this.opdId) {
                this.personExaminationService.getForOpd(this.opdId).then((response) => {
                    this.examinations = response;

                });
            }

            if (this.admissionId) {
                this.personExaminationService.getForAdmission(this.admissionId).then((response) => {
                    this.examinations = response;
                });
            }



        }




        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/overview/examination/visit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                opdId: "<",
                admissionId: "<",
                reload: "<"
            };

        }
    }

    app.component("mrsPersonVisitExaminationList", new Component());

}