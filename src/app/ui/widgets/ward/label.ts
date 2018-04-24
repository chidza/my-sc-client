namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IWardLabel extends ng.IController {

    }

    class Controller implements IWardLabel {

        wardId: string;

        ward = {} as data.IWard;

        count: number = 0;

        departmentName: string = "";

        static $inject = ["WardService", "AdmissionService", "DepartmentService"];
        constructor(private wardService: data.IWardService,
            private opdWard: data.IAdmissionService,
            private departmentService: data.IDepartmentService
        ) {

        }

        $onInit = () => {
            this.wardService.get(this.wardId).then((response) => {
                this.ward = response;

                this.departmentService.get(response.departmentId).then((response) => {
                    this.departmentName = response.name;
                });

            }, (error) => {
                console.log(error);
            });

            this.opdWard.people(this.wardId).then((response) => {
                this.count = response.length;
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/ward/label.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                wardId: "<"
            };

        }
    }

    app.component("mrsWardLabel", new Component());

}
