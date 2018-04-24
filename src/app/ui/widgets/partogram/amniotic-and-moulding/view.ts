namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramAmnioticAndMouldingView extends ng.IController {
    }

    class Controller implements IPartogramAmnioticAndMouldingView {

        date: string;
        vaginal = {} as data.IVaginalMonitoring;
        deliveryId: string;
        degrees: Array<data.IDegree> = [];
        amniotic: Array<data.IAmnioticFluid> = [];

        static $inject = ["VaginalMonitoringService", "DegreeService", "AmnioticFluidService", "dialogs", "DateUtils"];
        constructor(private vaginalService: data.IVaginalMonitoringService,
            private degreeService: data.IDegreeService,
            private amnioticService: data.IAmnioticFluidService,
            private dialog: ng.dialogservice.IDialogService,
            private dateUtils: utils.IDateUtils) {

        }
        $onInit = () => {
            this.degreeService.query().then((response) => {
                this.degrees = response;
            });

            this.amnioticService.query().then((response) => {
                this.amniotic = response;
                console.log(this.amniotic);
            });
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            if (this.deliveryId && this.date) {
                this.vaginalService.getByDate(this.deliveryId, this.date).then((response) => {
                    this.vaginal = response;
                });
            }
        }

        getAmniotic = (id: string): string => {
            let result: string = "";
            if (this.amniotic) {
                this.amniotic.forEach((a) => {
                    if (a.id === id) {
                        result = a.name;
                    }
                });
            }


            return result;
        }

        getDegree = (id: string): string => {
            let result: string = "";
            if (this.degrees) {
                this.degrees.forEach((d) => {
                    if (d.id === id) {
                        result = d.name;
                    }
                });
            }


            return result;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/amniotic-and-moulding/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                date: "<",
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramAmnioticAndMouldingView", new Component());

}
