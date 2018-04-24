namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterProcedureList extends ng.IController {
    addProcedure: () => void;
    editProcedure: (encounterProcedureId: Object) => void;
  }

  class Controller implements IEncounterProcedureList {

    encounterId: string;
    currentUser: string;
    workspaceId: string;
    personId: string;
    procedureId: string;
    list: Array<data.IEncounterProcedureList> = [];

    public refreshed: () => void;
    public addProcedure: () => void;
    public editProcedure: (encounterProcedureId: Object) => void;

    static $inject = ["EncounterProcedureService", "dialogs", "PersonProcedureService", "ConsultationService", "Principal"];
    constructor(private encounterProcedureService: data.IEncounterProcedureService,
      private dialog: ng.dialogservice.IDialogService,
      private personProcedureService: data.IPersonProcedureService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal) {

    }

    $onInit = () => {
      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });

      this.consultationService.getProcedures(this.workspaceId, this.personId).then((response) => {
        this.list = response;
      });

    }

    add = (model: data.IEncounterProcedureList) => {
      this.addProcedure();
    }

    edit = (model: data.IEncounterProcedureList) => {
      this.editProcedure({ id: model.encounterProcedureId });
    }

    disableControls = (model: data.IEncounterProcedureList) => {
      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;
    }


    delete = (model: data.IEncounterProcedureList) => {
      let msg = "You about to delete procedure. are you sure want go proceed";

      let dlg = this.dialog.confirm("confirm", msg);

      dlg.result.then(() => {

        console.log("model", model);
        this.encounterProcedureService.remove(model.encounterProcedureId).then((response) => {
          this.list.splice(this.list.indexOf(model), 1);
        }, () => {
          this.dialog.error("Deleting Error", "Procedure could not be removed")
        });

      }); () => {

      };
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-procedure/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addProcedure: "&",
        editProcedure: "&",
        encounterId: "<",
        workspaceId: "<",
        personId: "<",
      };

    }
  }

  app.component("mrsEncounterProcedureList", new Component());

}
