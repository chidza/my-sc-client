namespace mrs.ui {
"use strict";

let app = angular.module(mrs.appName);

interface IAdmissionDialog extends ng.IController {

}

class Controller implements IAdmissionDialog {

    admissionId: string;
    admission: data.IAdmission;

    static $inject = ["AdmissionService"];
    constructor(private admissionService: data.IAdmissionService) {

    }

    $onInit = () => {
        this.admissionService.get(this.admissionId).then((response) => {
            this.admission = response;
        }, (error) => {
            console.log(error);
        });
    }
    update = () => {
        this.admissionService.update(this.admission).then((response) => {

        }, (error) => {
            console.log(error);
        });
    }
}

class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
        public templateUrl = "app/ui/widgets/simple/dialog.html",
        public controllerAs = "vm",
        public controller = Controller) {
        this.bindings = {
            admissionId: "<"
        };

    }
}

app.component("mrsAdmissionDialog", new Component());

}
