namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);



    class Controller implements ng.IController {


        static $inject = ["$state"];
        constructor(private state: ng.ui.IStateService) {
        }

        select = (id: string) => {
            this.state.go("consultation.management.pnc.healthEducation.add", { educationTopicId: id });
        }

        close = () => {
            this.state.go("consultation.management.pnc.healthEducation.list");
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/pnc/education/education-select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }
    }

    app.component("mrsConsultationPatientPncHealthEducationSelectLayout", new Component());

}
