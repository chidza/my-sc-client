namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        htsId: string;

        static $inject = ["$stateParams", "HtsService", "dialogs", "$q"];
        constructor(params: ng.ui.IStateParamsService,
            private htsService: data.IHtsService,
            private dialog: ng.dialogservice.IDialogService,
            private q: ng.IQService) {
            this.htsId = params["htsId"];
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/hts/post-test/post-test.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientHtsPostTestLayout", new Component());

}
