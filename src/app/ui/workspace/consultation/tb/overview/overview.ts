namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        tb = {} as data.ITb;
        tbcategories: Array<data.ITbCategory> = [];
        hivStatus: data.IHivStatus;

        static $inject = ["$stateParams", "TbService", "TbCategoryService", "PersonService"];
        constructor(params: ng.ui.IStateParamsService,
            private tbService: data.ITbService,
            private tbCategoryService: data.ITbCategoryService,
            private personService: data.IPersonService) {
            this.personId = params["personId"];
        }

        $onInit = () => {
            this.tbCategoryService.query("").then((response) => {
                this.tbcategories = response;
            });

            this.tbService.current(this.personId).then((response) => {
                this.tb = response;
            });
            this.personService.hivStatus(this.personId, new Date()).then((response) => {
                this.hivStatus = response;
            });
        }

        getCategoryName = (id: string): String => {
            let result: String;
            if (this.tbcategories) {
                this.tbcategories.forEach((category) => {
                    if (category.id === id) {
                        result = category.name;
                    }
                });
            }
            return result;

        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/tb/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientTbOverviewLayout", new Component());

}
