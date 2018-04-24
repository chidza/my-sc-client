namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        deliveryId: string;
        start: string;
        end: string;
        currentTime: data.ICurrentTime;
        static $inject = ["$state", "$stateParams", "DeliveryService", "dialogs", "SiteSettingService",
            "$uibModal", "PartogramInformationService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService,
            private siteSettingService: data.ISiteSettingService,
            private modal: ng.ui.bootstrap.IModalService,
            private deliveryPartogramService: data.IPartogramInformationService) {
            this.deliveryId = params["deliveryId"];
            this.personId = params["personId"];
            console.log("deliveyry id >>>>>>>>>>>>>>", this.deliveryId);
        }

        $onInit = () => {
            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                if (response.startTime)
                    this.start = response.startTime;
                if (response.startTime)
                    this.end = response.endTime;
            });
        }
        modelTemplate = (header: string, body: string, footer: string) => {
            return `<div class="modal-header">           
                  <h4 class="modal-title">` + header + `</h4>
              </div>
              <div class="modal-body">
                <br/>` +
                body +
                ` <br></div>
              <div class="modal-footer">`
                + footer +
                `</div>`;
        }

        addCervix = (date: String) => {

            let parent = this;

            let header = "Cervical Dilatation and Descent of Head";

            let body =
                ` <mrs-cervix-dialog cervix-id="" section="PARTOGRAM" date="vm.data.date" 
                    delivery-id="vm.data.deliveryId"  closed="vm.close()" saved="vm.saved(cervixId)">
                    </mrs-cervix-dialog>`;

            let footer = "";

            let template: string = this.modelTemplate(header, body, footer);

            let modalInstance = this.modal.open({
                controller: ["data", function (data: any) {
                    this.data = data;

                    this.close = function () {
                        modalInstance.dismiss();
                    };

                    this.saved = function () {
                        modalInstance.close();
                    };

                }],
                resolve: {
                    data: {
                        date: date,
                        deliveryId: parent.deliveryId
                    }
                },
                template: template,
                controllerAs: "vm",
                size: "lg",
                backdrop: "static",
            });

            modalInstance.result.then(
                () => {
                    parent.admit();
                });
        }

        admit = () => {
            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                if (!response.startTime) {
                    this.siteSettingService.currentTime().then((response) => {
                        //  this.currentTime = response;
                        console.log("time response ", response);

                        let ct = response.currentTime;

                        let times = ct.toString().split("T");
                        let dlg = this.dialog.confirm("Confirm", "Are you sure you want admit patient onto the partogram at " + times[1].substring(0, 5) + "?");
                        dlg.result.then(() => {
                            this.addCervix(ct);
                        });
                    });
                } else {
                    this.deliveryPartogramService.getFirst(this.deliveryId).then((response) => {
                        this.state.go("consultation.management.partogram.record", { deliveryPartogramId: response.id });
                    });
                }
            });
        }

        addNew = (deliveryPartogramId: string) => {
             this.state.go("consultation.management.partogram.record", { deliveryId : this.deliveryId, deliveryPartogramId: deliveryPartogramId });
        }


    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/partogram/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPartogramOverviewLayout", new Component());

}
