namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHtsPreTestDialog extends ng.IController {
    }

    class Controller implements IHtsPreTestDialog {
        htsId: string;
        hts = {} as data.IHts;
        models: Array<data.IHtsModel> = [];
        purposes: Array<data.IHtsPurposeOfTest> = [];
        retest: string;
        pregnancy: string;

        static $inject = ["HtsService", "HtsModelService", "HtsPurposeOfTestService", "$q"];
        constructor(private htsService: data.IHtsService,
            private htsModelService: data.IHtsModelService,
            private htsPurposeOfTestService: data.IHtsPurposeOfTestService,
            private q: ng.IQService) {

        }

        $onInit = () => {
            if (this.htsId) {
                this.q.all<data.IHts, data.IHtsModel[], data.IHtsPurposeOfTest[]>(
                    [this.htsService.get(this.htsId),
                    this.htsModelService.query(),
                    this.htsPurposeOfTestService.query()]).then((response) => {
                        this.hts = response[0];
                        this.models = response[1];
                        this.purposes = response[2];

                    });
            }
        }

        save = () => {
 this.htsService.update(this.hts).then((response) => {
                console.log(response);
            }, (error) => {

            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/hts-pre-test/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                htsId: "<"
            };

        }
    }

    app.component("mrsHtsPreTestDialog", new Component());

}
