namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        deliveryId: string;
        essentialCareForBabiesId: string;
        start: string;
        end: string;
        currentTime: data.ICurrentTime;
        static $inject = ["$state", "$stateParams", "dialogs", "SiteSettingService",
            "$uibModal"];
        constructor(
            private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,

            private dialog: ng.dialogservice.IDialogService,
            private siteSettingService: data.ISiteSettingService,
            private modal: ng.ui.bootstrap.IModalService
        ) {
            this.essentialCareForBabiesId = params["essentialCareForBabiesId"];
            this.personId = params["personId"];

            console.log("deliveyry id >>>>>>>>>>>>>>", this.deliveryId);
        }

        $onInit = () => {

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
                    essentialCareForBabies-id="vm.data.essentialCareForBabiesId"  closed="vm.close()" saved="vm.saved(cervixId)">
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
                        essentialCareForBabiesId: parent.essentialCareForBabiesId
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
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientEssentialCareForBabiesOverviewLayout", new Component());

}
