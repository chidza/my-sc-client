namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IWardList extends ng.IController {
        wardSelected: (wardId: Object) => void;
    }

    class Controller implements IWardList {
        wards: Array<data.IWardList> = [];

        wardId: string;

        public wardSelected: (wardId: Object) => void;

        static $inject = ["WardService"];
        constructor(private wardService: data.IWardService) {

        }

        $onInit = () => {
            this.wardService.list().then((response) => {
                this.wards = response;
            }, (error) => {
                console.log(error);
            });
        }

        onWardSelected = (ward: data.IWard) => {
            this.wardSelected({ wardId: ward.id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/ward/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                wardId: "<",
                wardSelected: "&"
            };

        }
    }

    app.component("mrsWardList", new Component());

}
