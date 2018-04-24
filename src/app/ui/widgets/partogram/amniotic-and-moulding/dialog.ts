namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVaginalMonitoringDialog extends ng.IController {
    }

    class Controller implements IVaginalMonitoringDialog {

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
            });
        }

        init = () => {
            if (this.deliveryId && this.date) {
                this.vaginalService.getByDate(this.deliveryId, this.date).then((response) => {
                    this.vaginal = response;
                }, (error) => {
                    this.vaginal.deliveryId = this.deliveryId;
                    this.vaginal.date = new Date(moment(this.date));
                    this.vaginal.time = new Date(moment(this.date));
                });
            }
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        save = () => {

            if (this.vaginal.id !== "") {
                this.onSave(this.vaginalService.update(this.vaginal));
            }
            else {
                this.onSave(this.vaginalService.save(this.vaginal));
            }
        }

        onSave = (promise: ng.IPromise<data.IVaginalMonitoring>) => {
            promise.then((response) => {

                this.vaginal = response;
                this.vaginalService.checkVaginal(response.deliveryId, response.id).then((response) => {
                    let status: data.IVaginalStatus = response;
                    if (status.amniotic === "DANGER" || status.moulding === "DANGER" || status.caput === "DANGER") {
                        let dlg = this.dialog.error("Danger", "Patient in danger, please review and take appropriate action!");

                        dlg.closed.then(() => {
                        });
                    }
                });
            }, () => {
                // error!
            });
        }

        clear = () => {
            if (this.vaginal.id) {
                this.vaginalService.remove(this.vaginal.id).then((response) => {
                    this.vaginal = {} as data.IVaginalMonitoring;
                    this.init();
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/amniotic-and-moulding/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                date: "<",
                deliveryId: "<",
            };

        }
    }

    app.component("mrsPartogramAmnioticAndMouldingDialog", new Component());

}
