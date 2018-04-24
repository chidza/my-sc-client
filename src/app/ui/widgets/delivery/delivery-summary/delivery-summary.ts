namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliverySummaryDialog extends ng.IController {

    }

    class Controller implements IDeliverySummaryDialog {

        deliverySummaryId: string;
        deliverySummary: data.IDeliverySummary;
        tempAfterDelivery: data.IPersonVital;
        bpAfterDelivery: data.IPersonVital;
        bpAfterHrDelivery: data.IPersonVital;
        pulseAfterDelivery: data.IPersonVital;
        pulseAfterHrDelivery: data.IPersonVital;
        degrees: Array<data.IDegree> = [];



        static $inject = ["DeliverySummaryService", "DegreeService"];
        constructor(private deliverySummaryService: data.IDeliverySummaryService,
            private degreeService: data.IDegreeService) {

        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {

            this.degreeService.query().then((response) => {
                this.degrees = response;
            }, (error) => {
                console.log(error);
            });
            if (this.deliverySummaryId) {
                this.deliverySummaryService.get(this.deliverySummaryId).then((response) => {
                    this.deliverySummary = response;

                }, (error) => {
                    console.log(error);
                });
            }
        }

        update = () => {
            this.deliverySummaryService.update(this.deliverySummary).then((response) => {
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/delivery-summary/delivery-summary.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliverySummaryId: "<"
            };

        }
    }

    app.component("mrsDeliverySummaryDialog", new Component());

}
