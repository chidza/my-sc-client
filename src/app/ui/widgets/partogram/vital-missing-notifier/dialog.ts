namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVitalNotifierGraph extends ng.IController {

    }

    class Controller implements IVitalNotifierGraph {



        personId: string;
        deliveryId: string;
        vitalId: string;
        interval: number;
        start: string;
        end: string;
        vital: data.IVital;
        unit: data.IUnit;
        vitalList: Array<data.IVitalView> = [];



        static $inject = ["UnitService", "VitalService", "EncounterVitalService", "dialogs", "PersonVitalService", "DeliveryService", "LaborActivePhaseVitalService", "DateUtils"];
        constructor(
            private unitService: data.IUnitService,
            private vitalService: data.IVitalService,
            private encounterVitalService: data.IEncounterVitalService,
            private dialog: ng.dialogservice.IDialogService,
            private personVitalService: data.IPersonVitalService,
            private deliveryService: data.IDeliveryService,
            private getPulseForActiveLabourStageService: data.ILaborActivePhaseVitalService,
            private utils: utils.IDateUtils

        ) {


        }



        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {




            if (this.vitalId) {
                this.vitalService.get(this.vitalId).then((response) => {
                    this.vital = response;
                    this.unitService.get(this.vital.unitId).then((response) => {
                        this.unit = response;
                    });
                });
            }

            if (this.personId) {


                if (this.start && this.end) {



                    this.personVitalService.getByDateTimeInterval(this.personId, this.vitalId, this.interval, this.start, this.end).then((response) => {



                        this.vitalList = response;


                    });
                }




            }




        }




        formatTime = (date: Date): string => {

            return moment(date).format("HH:mm");

        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/vital-missing-notifier/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

                vitalId: "<",
                "start": "@",
                "end": "@",
                personId: "<",
                interval: "<"
            };

        }
    }

    app.component("mrsPartogramVitalMissingNotifier", new Component());

}