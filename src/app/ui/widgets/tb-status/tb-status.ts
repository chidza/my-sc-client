namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ITbStatusDialog extends ng.IController {

    }

    class Controller implements ITbStatusDialog {
        opdId: string;
        tbStatus = {} as data.IPersonTbStatus;



        static $inject = ["PersonExaminationService"];
        constructor(private personExaminationService: data.IPersonExaminationService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            console.log("opd-id", this.opdId);

            this.personExaminationService.getOpdTbStatus(this.opdId).then((reponse) => {
                this.tbStatus = reponse;
                console.log("tb status", this.tbStatus);
            });

        }
        update = () => {

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/tb-status/tb-status.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                opdId: "<"
            };

        }
    }

    app.component("mrsTbStatusDialog", new Component());

}
