namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        static $inject = ["$state"];
        constructor(private state: ng.ui.IStateService) {
        }

        select = (id: string) => {
            this.state.go("consultation.management.tb.examinations.add", { examinationId: id });
        }

        close = () => {
            console.log("TB");
            this.state.go("consultation.management.tb.examinations.list");
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/tb/examinations/select.html",
            public controllerAs = "vm",
            public controller = Controller) {

        }

    }

    app.component("mrsConsultationPatientTbExaminationSelectLayout", new Component());

}