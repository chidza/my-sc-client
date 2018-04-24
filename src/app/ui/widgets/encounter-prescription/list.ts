namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterMedicationList extends ng.IController {
    refreshed: () => void;
    addMedication: () => void;
    editMedication: (encounterMedicationId: Object) => void;
  }

  class Controller implements IEncounterMedicationList {
    refresh: number;
    encounterId: string;
    personId: string;
    prescriptionMedication: Array<data.IEncounterPrescriptionList>;
    prescriptionId: string;
    currentUser: string;
    workspaceId: string;

    public refreshed: () => void;
    public addMedication: () => void;
    public editMedication: (encounterMedicationId: Object) => void;

    static $inject = ["PrescriptionService", "dialogs", "$uibModal", "ConsultationService", "Principal"];
    constructor(private prescriptionService: data.IPrescriptionService,
      private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }



    init = () => {
      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });
      if (this.encounterId) {
        this.consultationService.getPrescriptions(this.workspaceId, this.personId).then((response) => {
          this.prescriptionMedication = response;
        }, (error) => {
          console.log("Error");
        });

      }

    }

    add = () => {
      this.addMedication();
    }

    recordDispense = () => {
      this.addMedication();
    }

    edit = (model: number) => {
      this.editMedication({ id: model });
    }

    delete = (entry: data.IEncounterPrescriptionList) => {
      let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");
      dlg.result.then((btn) => {
        this.prescriptionService.remove(entry.id).then((response) => {
          this.prescriptionMedication.splice(this.prescriptionMedication.indexOf(entry), 1);
          this.refreshed();
        });
      }, (error) => {
      });
    }


    dispense = (item: data.IEncounterPrescriptionList) => {

      let callback = this;
      this.prescriptionId = item.id;
      if (!item.dispenseId) {
        item.dispenseId = "";
      }
      let header = "Medication Dispense";

      let body = `
    <mrs-dispense-dialog person-id="vm.data.personId" encounter-id="vm.data.encounterId" drug-id="vm.data.drugId" frequency-id="vm.data.frequencyId"
     dispense-id="vm.data.dispenseId" closed="vm.close()" saved="vm.saved(dispenseId)">
    </mrs-dispense-dialog>

                `;

      let footer = ``;

      let template: string = this.modelTemplate(header, body, footer);
      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {


          this.data = data;

          this.close = function () {
            modalInstance.close();
          };

          this.saved = function (id: string) {
            modalInstance.dismiss(id);
          };
        }],
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
        resolve: {
          data: {
            drugId: item.drugId,
            personId: callback.personId,
            frequencyId: item.frequencyId,
            dispenseId: item.dispenseId,
            encounterId: callback.encounterId
          }
        }
      });
      modalInstance.result.then(
        () => {
        }, (id) => {
          this.prescriptionService.get(this.prescriptionId).then((response) => {
            response.dispenseId = id;
            this.prescriptionService.update(response).then(() => {
              this.init();
            });
          });

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
      public templateUrl = "app/ui/widgets/encounter-prescription/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addMedication: "&",
        editMedication: "&",
        encounterId: "<",
        personId: "<",
        workspaceId: "<",
        refreshed: "&",
        refresh: "<",
      };

    }
  }

  app.component("mrsEncounterMedicationList", new Component());

}
