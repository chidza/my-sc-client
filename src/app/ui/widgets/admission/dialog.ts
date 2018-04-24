namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);

  interface IAdmissionDialog extends ng.IController {
    closed: () => void;
    saved: (admissionId: Object) => void;
  }

  class Controller implements IAdmissionDialog {
    personId: string;
    workspaceId: string;
    workareaId: string;

    reload: number = 0;

    admission = {} as data.IAdmission;
    wards: Array<data.IWard> = [];
    diagnosis: data.IDiagnosis = {} as data.IDiagnosis;

    datePickerOpenStatus = {};

    public closed: () => void;
    public saved: (admission: Object) => void;

    static $inject = ["WardService", "AdmissionService", "EncounterDiagnosisService"
      , "DiagnosisService", "ConsultationService", "dialogs", "$uibModal"];
    constructor(private wardService: data.IWardService,
      private admissionService: data.IAdmissionService,
      private encounterDiagnosisService: data.IEncounterDiagnosisService,
      private diagnosisService: data.IDiagnosisService,
      private consultationService: data.IConsultationService,
      private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService) {

    }

    $onInit = () => {

      this.admissionService.current(this.personId).then((response) => {
        
        this.admissionService.get(response.admissionId).then((admission) => {
          this.admission = admission;
        });
        
        this.dialog.notify("Admission Service", "Patient already admitted");
      }, () => {
        this.admission = {
          time: new Date(),
          personId: this.personId
        } as data.IAdmission;
      });

      this.wardService.query().then((wards) => {
        this.wards = wards;
      });

    }

    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

    close = () => {
      this.closed();
    }

    save = () => {

      if (!this.diagnosis.id && this.isNewAdmission()) {

        let msg = "Are you sure want to proceed without specifying reason for admission?";

        this.dialog.confirm("Confirm action", msg).result.then(() => {
          this.proceed();
        }, () => {
          // stay on same page
        });

      } else {
        this.proceed();
      }

    }

    isNewAdmission = () => {
      return !this.admission.id;
    }

    proceed = () => {

      if (this.isNewAdmission()) {
        this.onSave(this.admissionService.save(this.admission));
      }
      else {
        this.onSave(this.admissionService.update(this.admission));
      }

    }

    onSave = (promise: ng.IPromise<data.IAdmission>) => {
      promise.then((admission) => {
        // uncomment line below when time field issues are resolved
        // this.admission = admission;
        
        this.dialog.notify("Notification", "Patient successfully admitted");

        // only save diagnosis for new admission
        if (this.isNewAdmission()) {
          // create encounter session
          this.consultationService.generalEncounter(this.workspaceId, this.workareaId, this.personId).then((encounter) => {

            // save diagnosis to encounter
            this.encounterDiagnosisService.save({
              encounterId: encounter.id,
              personDiagnosisId: this.diagnosis.id
            } as data.IEncounterDiagnosis).then(() => {
              this.saved({ admissionId: admission.id });
            }, () => {
              this.dialog.error("Diagnosis Error", "Patient sucessfully admitted with errors on diagnosis.");
              this.saved({ admissionId: admission.id });
            });

          }, (error) => {
            // ignore because sometimes we may not have and opd id since patient is now admitted
            this.saved({ admissionId: admission.id });
          });

        }

      }, (error) => {
        this.dialog.error("Admission Error", "Errors encountered on admission");
      });
    }

    selectDiagnosis = () => {

      let header = "Select Diagnosis";

      let body = `<mrs-diagnosis-select select-diagnosis= "vm.select(id)" closed="vm.close()"></mrs-diagnosis-select>`;

      let footer = ``;
      // <button class="btn btn-danger" ng-click="vm.close()">Close</button>

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.close = function () {
            modalInstance.close();
          };

          this.select = function (id: string) {
            modalInstance.dismiss(id);
          };
        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static"
      });

      modalInstance.result.then(
        () => {
          // ignore
        },
        (id) => {

          this.diagnosisService.get(id).then((diagnosis) => {
            this.diagnosis = diagnosis;
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
        `</div>
              <div class="modal-footer">`
        + footer +
        `</div>`;
    }

  }

  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/admission/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        workspaceId: "<",
        workareaId: "<",
        closed: "&",
        saved: "&"
      };
    }
  }

  app.component("mrsAdmissionDialog", new Component());

}