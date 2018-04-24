namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterVitalDialog extends ng.IController {
    saved: (personVitalId: Object) => void;
    closed: () => void;
  }

  class Controller implements IEncounterVitalDialog {

    personVitalId: string;
    vitalType: string;
    personId: string;
    encounterId: string;
    vitalId: string;
    personVital = {} as data.IPersonVital;
    encounterVitalId: string;
    encounterVitals: Array<data.IEncounterVitalList> = [];
    workspaceId: string;

    public saved: (personVitalId: Object) => void;
    public closed: () => void;

    static $inject = ["PersonVitalService", "SiteSettingService", "$uibModal", "EncounterVitalService", "ConsultationService", "dialogs"];
    constructor(private personVitalService: data.IPersonVitalService,
      private siteSettingService: data.ISiteSettingService,
      private modal: ng.ui.bootstrap.IModalService,
      private encounterVitalService: data.IEncounterVitalService,
      private consultationService: data.IConsultationService,
      private dialog: ng.dialogservice.IDialogService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

      if (this.personVitalId) {
        this.personVitalService.get(this.personVitalId).then((response) => {
          this.personVital = response;
        }
        );
      } else {

        this.siteSettingService.getSiteSetting(this.vitalType).then((setting) => {

          this.vitalId = setting.value;

          let timestamp = new Date();

          this.personVital = {
            date: timestamp,
            time: timestamp,
            value: "",
            personId: this.personId,
            vitalId: setting.value,
          } as data.IPersonVital;

        })

      }

    }

    update = () => {
      if (this.personVital.id) {
        this.edit();
      } else {
        this.add();
      }
    }

    edit = () => {
      console.log("edit mode");

      let callback = this;

      let header = "Vital Edit";

      let body = `<mrs-person-vital-dialog person-vital-id="vm.data.personVitalId" saved="vm.save(id)" closed="vm.close()"></mrs-person-vital-dialog>`;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {

          let vm = this;

          vm.data = data;

          vm.close = function () {
            modalInstance.close();
          };

          vm.save = function (id: string) {
            modalInstance.dismiss({ id: id });
          };

        }],
        resolve: {
          data: {
            personVitalId: callback.personVital.id
          }
        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
      });

      modalInstance.result.then(
        () => {
          this.closed();
        }, (response) => {

          this.personVitalService.get(response.id).then((personVital) => {
            this.personVital = personVital;
          });

        });

    }

    add = () => {

      let callback = this;

      let header = "Vital Add";

      let body = `
        <uib-tabset>      
            <uib-tab heading="Recent Vitals" active="true">
              <mrs-encounter-vital-selected-list person-id = "vm.data.personId" workspace-id = "vm.data.workspaceId"
                vital-id = "vm.data.vitalId" selected = "vm.save(id)" closed = "vm.close()"></mrs-encounter-vital-selected-list>
            </uib-tab> 
            <uib-tab heading="New">
              <mrs-encounter-vital-dialog encounter-id = "vm.data.encounterId" person-vital-id = "" person-id = "vm.data.personId"
                vital-id = "vm.data.vitalId" saved = "vm.save(id)" closed = "vm.close()"></mrs-encounter-vital-dialog>
            </uib-tab>
        </uib-tabset>`;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {
          let vm = this;
          vm.data = data;

          vm.close = function () {
            modalInstance.close();
          };

          vm.save = function (id: string) {
            modalInstance.dismiss({ id: id });
          };

        }],
        resolve: {
          data: {
            personId: callback.personId,
            workspaceId: callback.workspaceId,
            vitalId: callback.vitalId,
            encounterId: callback.encounterId
          }
        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
      });

      modalInstance.result.then(
        (id) => {
          this.closed();
        }, (response) => {

          console.log("response from : ", response);

          this.encounterVitalService.get(response.id).then((response) => {           

            this.personVitalService.get(response.personVitalId).then((personVital) => {
              this.personVital = personVital;
              this.saved({ personVitalId: personVital.id });
            });

          }, (error) => {
            this.dialog.error("Error", "Could not persist vital at this time. Please try again.");
            this.closed();
          })
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

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-vital/individual.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personVitalId: "<",
        personId: "<",
        workspaceId: "<",
        encounterId: "<",
        vitalType: "<",
        closed: "&",
        saved: "&"
      };

    }


  }

  app.component("mrsEncounterIndividualVitalDialog", new Component());

}
