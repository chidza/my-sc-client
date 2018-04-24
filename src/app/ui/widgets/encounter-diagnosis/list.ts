namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterDiagnosisList extends ng.IController {
    addDiagnosis: () => void;
    editDiagnosis: (encounterDiagnosisId: Object) => void;
  }

  class Controller implements IEncounterDiagnosisList {

    encounterId: string;
    currentUser: string;
    workspaceId: string;
    personId: string;
    list: Array<data.IEncounterDiagnosisList> = [];
    public addDiagnosis: () => void;
    public editDiagnosis: (encounterDiagnosisId: Object) => void;



    static $inject = ["EncounterDiagnosisService", "PersonDiagnosisService", "dialogs",
      "ConsultationService", "Principal"];
    constructor(private encounterDiagnosisService: data.IEncounterDiagnosisService,
      private personDiagnosisService: data.IPersonDiagnosisService,
      private dialog: ng.dialogservice.IDialogService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal) {

    }

    $onInit = () => {
      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });

      this.consultationService.getDiagnoses(this.workspaceId, this.personId).then((response) => {
        console.log("response", response);
        this.list = response;

      }, (error) => {
        console.log(error);
      });
    }

    disableControls = (model: data.IEncounterComplaintList) => {

      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;
    }


    add = () => {
      this.addDiagnosis();
    }

    edit = (model: data.IEncounterDiagnosisList) => {
      this.editDiagnosis({ id: model.encounterPersonDiagnosisId });
    }
    delete = (model: data.IEncounterDiagnosisList) => {
      let msg = "You about to delete patient diagnosis. Are you sure about this?";
      let dlg = this.dialog.confirm("Confirm", msg);

      dlg.result.then(() => {
        this.encounterDiagnosisService.remove(model.encounterPersonDiagnosisId).then((response) => {
          this.list.splice(this.list.indexOf(model), 1);

        }, () => {
          this.dialog.error("Deleting Error", "Diagnosis could not be removed")
        })
      }), () => {

      }
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-diagnosis/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addDiagnosis: "&",
        editDiagnosis: "&",
        encounterId: "<",
        workspaceId: "<",
        personId: "<"
      };

    }
  }

  app.component("mrsEncounterDiagnosisList", new Component());

}
