namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        encounterId: string;
        imnciVisit = {} as data.IImnciVisit;

        static $inject = ["$state", "$stateParams", "ImnciVisitService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private imnciVisitService: data.IImnciVisitService) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
        }

        $onInit = () => {
            this.imnciVisitService.getByEncounterId(this.encounterId).then((response) => {
                this.imnciVisit = response;
            }, (err) => {
                this.imnciVisit.encounterId = this.encounterId;
                this.imnciVisit.date = new Date();
                this.imnciVisitService.save(this.imnciVisit).then((response) => {
                    this.imnciVisit = response;
                });
            });
        }

        visit = () => {
            this.state.go("consultation.management.imncivisit.danger", { imnciVisitId: this.imnciVisit.id });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/imnci/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientImnciMenuLayout", new Component());

}
