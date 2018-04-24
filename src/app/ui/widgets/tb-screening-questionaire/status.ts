namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ITbScreeningStatus extends ng.IController {
        done: () => void;
    }

    class Controller implements ITbScreeningStatus {
        personId: string;
        encounterId: string;
        tbStatus: data.IPersonTbStatus;
        reload: number;
        public done: () => void;

        static $inject = ["OpdService", "SiteSettingService", "$uibModal", "PersonExaminationService", "AdmissionService"];
        constructor(private opdService: data.IOpdService,
            private siteSettingService: data.ISiteSettingService,
            private modal: ng.ui.bootstrap.IModalService,
            private personExaminationService: data.IPersonExaminationService,
            private admissionService: data.IAdmissionService) {
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            this.opdService.current(this.personId).then((response) => {
                this.personExaminationService.getOpdTbStatus(response.id).then((response) => {
                    this.tbStatus = response;
                });
            }, (error) => {
                this.admissionService.current(this.personId).then((response) => {
                    this.personExaminationService.getAdmissionTbStatus(response.id).then((response) => {
                        this.tbStatus = response;
                    });
                });
            });
        }

        screen = () => {

            let callback = this;

            let header = "TB SCREEN";

            let body = `

            <mrs-tb-screening-dialog category-name="SCREENING" closed="vm.close()" 
            encounter-id="vm.data.encounterId" person-id="vm.data.personId" select-examination="vm.select(id)"></mrs-tb-screening-dialog>
`;

            let footer = ``;

            let template: string = this.modelTemplate(header, body, footer);
            let modalInstance = this.modal.open({
                controller: ["data", function (data: any) {

                    this.data = data;

                    this.close = function () {
                        modalInstance.close();
                    };

                    this.select = function (id: string) {
                        modalInstance.dismiss(id);
                    };
                }],
                template: template,
                controllerAs: "vm",
                size: "lg",
                backdrop: "static",
                resolve: {
                    data: {
                        personId: callback.personId,
                        encounterId: callback.encounterId
                    }
                }
            });
            modalInstance.result.then(
                () => {
                    this.init();
                    this.done();
                }
            );
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

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/tb-screening-questionaire/status.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                encounterId: "<",
                reload: "<",
                done: "&"
            };

        }


    }

    app.component("mrsTbScreeningStatus", new Component());

}
