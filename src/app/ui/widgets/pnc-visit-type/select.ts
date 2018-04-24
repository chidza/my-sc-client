namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncVisitTypeSelect extends ng.IController {

        selectPncVisitType: (id: Object) => void;
    }

    class Controller implements IPncVisitTypeSelect {

        pncVisitTypeId: string;
        pncVisitTypes: Array<data.IPncVisitType> = [];

        public selectPncVisitType: (personId: Object) => void;

        static $inject = ["PncVisitTypeService"];
        constructor(private pncVisitTypeService: data.IPncVisitTypeService) {

        }

        $onInit = () => {
            this.pncVisitTypeService.query().then((response) => {
                this.pncVisitTypes = response;

            });
        }

        onSelect = (item: data.IPncVisitType) => {
            this.selectPncVisitType({ id: item.id });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/pnc-visit-type/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selectPncVisitType: "&"
            };

        }
    }

    app.component("mrsPncVisitTypeDialog", new Component());

}
