namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryMotherOutcome extends ng.IController {

    }

    class Controller implements IDeliveryMotherOutcome {

        personId: string;

        encounterId: string;
        workspaceId: string;
        delivery: data.IDelivery;
        deliverySummaryId: string;
        diagnosisId: string;
        deliveryId: string;
        motherOutcome: string;
        $router: any;
        disableAlive: boolean = false;
        disableDead: boolean = false;

        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs", "MaternalDeathService", "DeliverySummaryService"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private maternanlDeathService: data.IMaternalDeathService,
            private deliverySummaryService: data.IDeliverySummaryService) {
            this.personId = params["personId"];
            this.encounterId = params["encounterId"];
            this.diagnosisId = params["diagnosisId"];
            this.workspaceId = params["workspaceId"];
        }

        $onInit = (): void => {
            this.deliveryService.current(this.personId).then((response) => {
                this.delivery = response;
                this.deliverySummaryId = this.delivery.deliverySummaryId;
                this.deliveryId = this.delivery.id;
                this.deliverySummaryService.get(this.deliverySummaryId).then((response) => {
                    if (response.tempAfterDeliveryId || response.bpAfterDeliveryId || response.bpAfterHrDeliveryId
                        || response.pulseAfterDeliveryId || response.pulseAfterHrDeliveryId || response.uterusContracted) {
                        this.disableDead = true;
                        this.motherOutcome = "ALIVE";
                    }
                });
                this.maternanlDeathService.getByDelivery(this.deliveryId).then((response) => {
                    this.motherOutcome = "DEAD";
                    this.disableAlive = true;
                }, (error) => {

                });
            });
        }

        add = () => {
            this.$router.navigate(["DeliveryMotherOutcomeDiagnosis", { encounterId: this.encounterId, personId: this.personId }]);
        }

        outcomeChanged = () => {
            if (this.motherOutcome === "DEAD") {
                let dlg = this.dialog.confirm("Warning!", "This operation cannot be changed. Are you sure you the mother is dead?");

                dlg.result.then((btn) => {
                    this.disableAlive = true;
                }, (error) => {
                    this.motherOutcome = null;
                });
            }

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/workspace/consultation/delivery/summary/mother-outcome/mother-outcome.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };

        }
    }

    app.component("mrsConsultationPatientDeliverySummaryMotherLayout", new Component());

}
