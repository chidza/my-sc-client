namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);


    class Controller implements ng.IController {

        labInvestigationId: string;
        labInvestigation = {} as data.ILabInvestigation;
        personLabInvestigation = {} as data.ILabInvestigationList;
        datePickerOpenStatus = {};
        investigationResults: Array<data.IResult> = [];
        result: string;
        resultDate: Date;
        personInvestigation = {} as data.IPersonInvestigation;

        static $inject = ["$state", "LabInvestigationService", "$stateParams", "InvestigationResultService", "PersonInvestigationService"];
        constructor(private state: ng.ui.IStateService,
            private labInvestigationService: data.ILabInvestigationService,
            private params: ng.ui.IStateParamsService,
            private investigationResultService: data.IInvestigationResultService,
            private personInvestigationService: data.IPersonInvestigationService) {
            this.labInvestigationId = params["labInvestigationId"];
        }

        $onInit = (): void => {

            this.labInvestigationService.getLabInvestigationId(this.labInvestigationId).then((response) => {
                this.personLabInvestigation = response;

                this.labInvestigationService.get(this.labInvestigationId).then((response) => {
                    this.labInvestigation = response;

                    this.labInvestigation.resultDate = new Date(moment(this.labInvestigation.resultDate).format("YYYY-MM-DD"));
                });
                console.log("calling");
                console.log(response);

                this.personInvestigationService.get(this.personLabInvestigation.personInvestigationId).then((response) => {
                    this.personInvestigation = response;
                });

                this.investigationResultService.getResultByInvestigationId(this.personLabInvestigation.investigationId).then((response) => {
                    this.investigationResults = response;
                });

            });




        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            this.personInvestigation.result = this.labInvestigation.result;
            this.personInvestigation.resultDate = new Date(moment(this.labInvestigation.resultDate).format("YYYY-MM-DD"));
            this.personInvestigationService.update(this.personInvestigation).then((response) => {
                console.log("labinvestigation");
                console.log(this.labInvestigation);
                this.labInvestigationService.update(this.labInvestigation).then((response) => {
                    this.state.go("laboratory.list");
                });
            });



        }

        cancel = () => {
            this.state.go("laboratory.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/laboratory/edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsLaboratoryEdit", new Component());

}
