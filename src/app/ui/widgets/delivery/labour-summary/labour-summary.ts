namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ILabourSummaryDialog extends ng.IController {

    }

    class Controller implements ILabourSummaryDialog {

        labourSummaryId: string;
        labourSummary: data.ILabourSummary;
        laboursummaries: Array<data.ILabourSummary> = [];

        static $inject = ["LabourSummaryService"];
        constructor(private labourSummaryService: data.ILabourSummaryService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.labourSummaryId) {
                this.labourSummaryService.get(this.labourSummaryId).then((response) => {
                    this.labourSummary = response;
                    if (!this.labourSummary.birthPlace) {
                        this.labourSummary.birthPlace = "HOSPITAL_CLINIC";
                        this.update();
                    }

                }, (error) => {
                    console.log(error);
                });
            }
        }
        update = () => {
            this.labourSummaryService.update(this.labourSummary).then((response) => {
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/labour-summary/labour-summary.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                labourSummaryId: "<"
            };

        }
    }

    app.component("mrsLabourSummaryDialog", new Component());

}
