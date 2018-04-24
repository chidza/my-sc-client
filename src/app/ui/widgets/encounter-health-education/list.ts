namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterHealthEducationList extends ng.IController {
    addHealthEducation: () => void;
    editHealthEducation: (encounterPersonHealthEducationId: Object) => void;
  }

  class Controller implements IEncounterHealthEducationList {

    encounterId: string;
    currentUser: string;
    workspaceId: string;
    personId: string;

    list: Array<data.IEncounterHealthEducationList> = [];

    public addHealthEducation: () => void;
    public editHealthEducation: (encounterPersonHealthEducationId: Object) => void;

    static $inject = ["EncounterHealthEducationService", "dialogs", "PersonHealthEducationService", "ConsultationService", "Principal"];
    constructor(private encounterHealthEducationService: data.IEncounterHealthEducationService,
      private dialog: ng.dialogservice.IDialogService,
      private personHealthEducationService: data.IPersonHealthEducationService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal
    ) {

    }

    $onInit = (): void => {

      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });

      this.consultationService.getHealthEducations(this.workspaceId, this.personId).then((response) => {
        this.list = response;
      });
    }

    disableControls = (model: data.IEncounterHealthEducationList) => {
      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;


    }

    add = () => {
      this.addHealthEducation();
    }

    edit = (model: data.IEncounterHealthEducationList) => {

      
      this.editHealthEducation({ id: model.encounterPersonHealthEducationId });
    }


    delete = (model: data.IEncounterHealthEducationList) => {
      let msg = "You are about to delete patient complaint. Are you sure you want to proceed?";

      let dlg = this.dialog.confirm("Confirm", msg);

      dlg.result.then(() => {

        let id = model.encounterPersonHealthEducationId;

        this.encounterHealthEducationService.remove(id).then((response) => {
          this.list.splice(this.list.indexOf(model), 1);
        }, () => {
          this.dialog.error("Deletion Error", "HealthEducation could not be removed. Please try again");
        });

      }, () => { });
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-health-education/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addHealthEducation: "&",
        editHealthEducation: "&",
        encounterId: "<",
        workspaceId: "<",
        personId: "<"
      };

    }
  }

  app.component("mrsEncounterHealthEducationList", new Component());

}
