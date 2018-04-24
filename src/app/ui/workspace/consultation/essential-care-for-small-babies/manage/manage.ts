namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEssentialCareForBabiesManage extends ng.IController {

    }

    class Controller implements IEssentialCareForBabiesManage {

        personId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService) {


            this.personId = params["personId"];
        }

        onEdit = (id: string) => {
            this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: id });
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/manage/manage.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
            };

        }
    }

    app.component("mrsConsultationPatientEssentialCareForBabiesManageLayout", new Component());

}
