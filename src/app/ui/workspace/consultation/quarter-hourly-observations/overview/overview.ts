namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        workareaId: string;
        encounterId: string;
        deliveryId: string;

        static $inject = ["$state", "DeliveryService", "$stateParams",
            "SiteSettingService", "dialogs", "QuarterHourlyService"];
        constructor(
            private state: ng.ui.IStateService,
            private deliveryService: data.IDeliveryService,
            params: ng.ui.IStateParamsService,
            private siteSettingService: data.ISiteSettingService,
            private dialogs: ng.dialogservice.IDialogService,
            private quarterHourlyService: data.IQuarterHourlyService
        ) {
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.deliveryId = params["deliveryId"];
        }

        $onInit = () => {

            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;
            });
        }

        onEdit = (id: string) => {
            this.state.go("consultation.management.quarterly-hourly.vitals.edit", { quarterHourlyId: id });
        }

        onView = (id: string) => {
            this.state.go("consultation.management.quarterly-hourly.vitals.list", { quarterHourlyId: id });
        }

        onAdd = (): void => {

            let dlg = this.dialogs.confirm("Confirm", "Are you sure you want add quarter hourly observation");
            dlg.result.then(() => {
                this.quarterHourlyService.saveQuarterHourly(this.deliveryId).then((response) => {
                    this.state.go("consultation.management.quarterly-hourly.vitals.add", { quarterHourlyId: response.id });
                }, (error) => {
                    console.log("unable to save");
                });

            }, (error) => {
                console.log(error);
            });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/quarter-hourly-observations/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

            };

        }
    }

    app.component("mrsConsultationPatientQuarterHourlyOverviewLayout", new Component());

}
