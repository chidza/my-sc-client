namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterExaminationList extends ng.IController {
    addExamination: () => void;
    editExamination: (id: Object) => void;
  }

  class Controller implements IEncounterExaminationList {

    encounterId: string;
    personId: string;
    currentUser: string;
    workspaceId: string;
    essentialBabyCareId: string;
    personExaminationList: Array<data.IEssentialBabiesCareExaminationList> = [];

    list: Array<data.IEncounterExaminationList> = [];

    public addExamination: () => void;
    public editExamination: (id: Object) => void;

    static $inject = ["EssentialBabiesCareService", "$stateParams", "EncounterExaminationService", "dialogs", "PersonExaminationService", "ConsultationService", "Principal"];
    constructor(
      private essentialBabiesCareService: data.IEssentialBabiesCareService,
      private params: ng.ui.IStateParamsService,
      private encounterExaminationService: data.IEncounterExaminationService,
      private dialog: ng.dialogservice.IDialogService,
      private personExaminationService: data.IPersonExaminationService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {


      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });

      console.log("this.essentialBabyCareId");
     console.log(this.essentialBabyCareId);

      this.essentialBabiesCareService.getessentialBabiesCareExaminations(this.essentialBabyCareId).then((response) => {
        console.log("<<<-------------examinations----response------------------>>>>>>>>>>>>>>>>>>");
        console.log(response);
        this.personExaminationList = response;



      }

        , (error) => {
          console.log("Error");
        });
    }

    add = () => {
      // send the essentialBabyCareId
      this.addExamination();
    }

    edit = (model: data.IEncounterExaminationList) => {
      this.editExamination({ id: model.encounterPersonExaminationId });
    }

    disableControls = (model: data.IEncounterExaminationList) => {
      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;
    }
    delete = (model: data.IEncounterExaminationList) => {
      let msg = "You are about to delete patient examination. Are you sure you want to delete?";
      let dlg = this.dialog.confirm("Confirm", msg);
      dlg.result.then((btn) => {

        let id = model.encounterPersonExaminationId;
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
      public templateUrl = "app/ui/widgets/essential-care-for-babies-examinations/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addExamination: "&",
        editExamination: "&",
        essentialBabyCareId: "<",
        encounterId: "<",
        workspaceId: "<",
        personId: "<"
      };

    }
  }

  app.component("mrsConsultationPatientEssentialCareForBabiesListExaminationLayout", new Component());

}