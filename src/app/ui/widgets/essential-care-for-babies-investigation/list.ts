namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);
  interface IEncounterInvestigationList extends ng.IController {
    hts: () => void;
    closed: () => void;
    addInvestigation: () => void;
    editInvestigation: (encounterInvestigationId: Object) => void;
    performTest: (encounterInvestigationId: Object) => void;
    sendToLab: (encounterInvestigationId: Object) => void;
  }

  class Controller implements IEncounterInvestigationList {
    investigationId: string;
    personId: string;
    encounterId: string;
    workspaceId: string;
    list: Array<data.IEncounterInvestigationList> = [];
    investigations: Array<data.ILabTest> = [];
    currentUser: string;
    section: string;
    workareaId: string;

    public closed: () => void;

    public addInvestigation: () => void;
    public editInvestigation: (encounterInvestigationId: Object) => void;
    public performTest: (encounterInvestigationId: Object) => void;
    public sendToLab: (encounterInvestigationId: Object) => void;

    static $inject = ["$state", "$stateParams", "dialogs", "ConsultationService", "Principal", "EncounterInvestigationService"];
    constructor(private state: ng.ui.IStateService,
      private params: ng.ui.IStateParamsService,
      private dialog: ng.dialogservice.IDialogService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal,
      private encounterInvestigationService: data.IEncounterInvestigationService) {
      this.workspaceId = params["workspaceId"];
      this.workareaId = params["workareaId"];
    }


    $onInit = () => {
      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });

      this.consultationService.getInvestigations(this.workspaceId, this.personId).then((response) => {
        this.list = response;
      });
    }

    hts = () => {
      let state = "consultation.management.hts.overview";
      let dlg = this.dialog.confirm("HTS Module", "Do you want to proceed to HTS Module?");
      dlg.result.then((btn) => {
        this.consultationService.htsEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
          this.state.go(state, {
            workareaId: this.workareaId, personId: this.personId,
            encounterId: response.encounterId, htsId: response.htsId
          });
        });
      });

    }

    add = () => {
      this.addInvestigation();
    }

    perform = (model: data.IEncounterInvestigationList) => {
      this.performTest({ id: model.personInvestigationId });
    }

    send = (model: data.IEncounterInvestigationList) => {
      this.sendToLab({ id: model.personInvestigationId });
    }
    close = () => {
      this.closed();
    }

    disableControls = (model: data.IEncounterInvestigationList) => {
      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;
    }

    delete = (model: data.IEncounterInvestigationList) => {

      let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

      dlg.result.then((btn) => {
        this.encounterInvestigationService.remove(model.encounterInvestigationId).then((response) => {
          this.list.splice(this.list.indexOf(model), 1);
        }, () => {
          this.dialog.error("Deleting Error", "Investigation could not be removed");
        });


      }, (error) => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/essential-care-for-babies-investigation/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addInvestigation: "&",
        editInvestigation: "&",
        performTest: "&",
        sendToLab: "&",
        investigationId: "<",
        personId: "<",
        section: "@",
        closed: "&",
        encounterId: "<",
      };

    }
  }

  app.component("mrsEssentialCareBabiesInvestigationList", new Component());

}
