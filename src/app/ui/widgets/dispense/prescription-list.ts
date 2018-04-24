namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDispensePrescriptionList extends ng.IController {
        selected: (prescriptionId: Object) => void;
        addPrescription: () => void;
    }

    class Controller implements IDispensePrescriptionList {
        personId: string;
        prescriptions: Array<data.IEncounterPrescriptionList> = [];

        public selected: (drugId: Object) => void;
        public addPrescription: () => void;

        static $inject = ["PrescriptionService"];
        constructor(private prescriptionService: data.IPrescriptionService) {

        }

        $onInit = () => {
            this.prescriptionService.getPersonPrescriptions(this.personId).then((response) => {
                this.prescriptions = response;
                console.log(this.prescriptions);
            });
        }
        add = () => {
            this.addPrescription();
        }

        select = (item: data.IEncounterPrescriptionList) => {
            this.selected({ prescriptionId: item.id });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/dispense/prescription-list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                selected: "&",
                addPrescription: "&"
            };

        }
    }

    app.component("mrsDispensePrescriptionList", new Component());

}
