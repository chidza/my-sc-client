namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMedicationView extends ng.IController {
    }

    class Controller implements IMedicationView {

        start: Date;
        end: Date;
        medications: Array<data.IMedicationList> = [];
        deliveryId: string;
        width: number;

        static $inject = ["LaborActivePhaseMedicationService", "DeliveryService", "dialogs", "DateUtils"];
        constructor(private laborActiveMedicationService: data.ILaborActivePhaseMedicationService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private utils: utils.IDateUtils) { }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId && this.start) {
                this.laborActiveMedicationService.getByDeliveryIdAndDateTimeBetween(this.deliveryId, this.start, this.end).then((response) => {
                    this.medications = response;
                });
            }

        }

        getDrugs = (items: Array<data.IDrugName> = []): string => {
            let result: string = "";
            items.forEach((item) => {
                result = item.name + ", " ;
            });

            if (result.length > 0) {
                return result.substring(0, result.length - 2);
            } else {

                return result;
            }
        }

    }
    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/iv-and-fluids-epartograph/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                start: "<",
                end: "<",
                width: "<"
            };

        }
    }

    app.component("mrsMedicationViewVertical", new Component());

}
