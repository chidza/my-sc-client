namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
        id: string;
    }

    class Controller implements ng.IController {

        personId: string;
        medicalAidId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService, params: IParams) {
            this.personId = params.personId;
            this.medicalAidId = params.id;
            console.log(this.medicalAidId);
        }

        onClose = (id: string) => {
            this.state.go("reception.management.medicalaid", { personId: this.personId });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/medical-aid/medical-edit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionFileManagementMedicalAidEdit", new Component());

}
