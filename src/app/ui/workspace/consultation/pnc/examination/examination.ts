namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncAdmissionExamination extends ng.IController {

    }

    class Controller implements IPncAdmissionExamination {

        $router: any;
        pncVisit = {} as data.IPncVisit;
        pncVisitId: string;
        pncvisittypes: Array<data.IPncVisitType> = [];

        static $inject = ["$state", "$stateParams", "PncVisitService", "PncVisitTypeService", "PncService", "PncVisitModuleService", "OpdService"];

        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private pncVisitService: data.IPncVisitService,
            private pncVisitTypeService: data.IPncVisitTypeService,
            private pncService: data.IPncService,
            private pncVisitModuleService: data.IPncVisitModuleService,
            private opdService: data.IOpdService) {
            this.pncVisitId = params["pncVisitId"];
        }

        $onInit = (): void => {
            this.pncVisitTypeService.query().then((response) => {
                this.pncvisittypes = response;
            });

            this.pncVisitService.get(this.pncVisitId).then((response) => {
                this.pncVisit = response;
            });

        }


        save = (pncVisitTypeId: data.IPncVisitType) => {
            this.pncVisitService.update(this.pncVisit).then((response) => {
                this.pncVisit = response;
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/examination/examination.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

            };

        }
    }

    app.component("mrsConsultationPatientPncExaminationLayout", new Component());

}
