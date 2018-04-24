namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterExaminationList extends ng.IController {
    addExamination: () => void;
    editExamination: (id: Object) => void;
    deleteExamination: (id: Object) => void;
    refreshed: () => void;
  }

  class Controller implements IEncounterExaminationList {

    encounterId: string;
    personId: string;
    currentUser: string;
    workspaceId: string;
    reload: number;
    list: Array<data.IEncounterExaminationList> = [];

    public addExamination: () => void;
    public editExamination: (id: Object) => void;
    public deleteExamination: (id: Object) => void;
    public refreshed: () => void;

    static $inject = ["EncounterExaminationService", "dialogs", "PersonExaminationService", "ConsultationService", "Principal"];
    constructor(
      private encounterExaminationService: data.IEncounterExaminationService,
      private dialog: ng.dialogservice.IDialogService,
      private personExaminationService: data.IPersonExaminationService,
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

      this.consultationService.getExaminations(this.workspaceId, this.personId).then((response) => {
        this.list = response;
      }, (error) => {
        console.log("Error");
      });
    }

    add = () => {
      this.addExamination();
    }

    edit = (model: data.IEncounterExaminationList) => {
      this.editExamination({ id: model.encounterPersonExaminationId });
    }


    deleting = (model: data.IEncounterExaminationList) => {
      this.deleteExamination({ id: model.encounterPersonExaminationId });
    }

    disableControls = (model: data.IEncounterExaminationList) => {
      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;
    }
    delete = (model: data.IEncounterExaminationList) => {
      let msg = "You are about to delete patient examination. Are you sure you want to delete?";
      let dlg = this.dialog.confirm("Confirm", msg);
      dlg.result.then((btn) => {

        let id = model.encounterPersonExaminationId;
        console.log("about to call deleting method");
        this.deleting(model);



        this.encounterExaminationService.remove(id).then((response) => {




          this.list.splice(this.list.indexOf(model), 1);



        }, () => {
          this.dialog.error("Deletion Error", "Examination could not be removed. Please try again");
        });

      }, (error) => {

      });
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-examination/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addExamination: "&",
        editExamination: "&",
        deleteExamination: "&",
        encounterId: "<",
        workspaceId: "<",
        personId: "<",
        reload: "<",
        refreshed: "&"
      };

    }
  }

  app.component("mrsEncounterExaminationList", new Component());

}