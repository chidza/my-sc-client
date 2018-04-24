namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncVisitDialog extends ng.IController {

    }

    class Controller implements IAncVisitDialog {

        opdId: string;
        queueId: string;
        ancId: string;
        ancVisit: data.IAncVisit;
        feedingOptions: Array<data.IFeedingOption> = [];

        static $inject = ["AncVisitService", "FeedingOptionService"];
        constructor(private ancVisitService: data.IAncVisitService,
            private feedingOptionService: data.IFeedingOptionService) {

        }

        $onInit = () => {
            this.ancVisitService.ancSession(this.opdId, this.queueId, this.ancId).then((response) => {
                this.ancVisit = response;
            }, (error) => {
            });

            this.feedingOptionService.query("").then((response) => {
                this.feedingOptions = response;
            });
        }

        update = () => {
            this.ancVisitService.update(this.ancVisit).then((response) => {

            }, (error) => {
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc/anc-visit/anc-visit-dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                opdId: "<",
                queueId: "<",
                ancId: "<"
            };

        }
    }

    app.component("mrsAncVisitDialog", new Component());

}
