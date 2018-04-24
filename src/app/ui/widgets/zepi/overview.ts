
namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IZepiOverviewDialog extends ng.IController {

    }

    class Controller implements IZepiOverviewDialog {

        personId: string;
        list: Array<data.IPersonZepiList>;



        static $inject = ["PersonMedicationService"];
        constructor(private personMedicationService: data.IPersonMedicationService) {

        }

        $onInit = () => {
            this.personMedicationService.getByZepi(this.personId).then((response: any) => {
                this.list = response;
            }, (error: any) => {
                console.log(error);
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/zepi/overview.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<"

            };

        }
    }

    app.component("mrsZepiOverviewDialog", new Component());

}
