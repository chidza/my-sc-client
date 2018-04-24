namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IDischargedDialog extends ng.IController {
    closed: () => void;
    saved: () => void;
  }

  class Controller implements IDischargedDialog {
    personId: string;
    workspaceId: string;
    workareaId: string;

    encounterId: string;
    encounterNoteId: string;

    public closed: () => void;
    public saved: () => void;

    static $inject = ["PersonService", "EncounterNoteService", "ConsultationService"];
    constructor(
      private personService: data.IPersonService,
      private encounterNoteService: data.IEncounterNoteService,
      private consultationService: data.IConsultationService
    ) {

    }

    discharge = () => {
      this.consultationService.discharge(this.workspaceId, this.workareaId, this.personId).then((opd) => {
        this.saved();
      });
    }

    $onInit = () => {

      this.consultationService.generalEncounter(this.workspaceId, this.workareaId, this.personId).then((encounter) => {
        this.encounterId = encounter.id;

        this.encounterNoteService.getNotesByEncounterId(encounter.id).then((note) => {
          this.encounterNoteId = note[note.length - 1].id;
        }, () => {
          this.encounterNoteId = "";
        });

      });

    }

    close = () => {
      this.closed();
    }

    noteSaved = (id: string) => {
      this.encounterNoteId = id;
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/discharged/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        saved: "&",
        closed: "&",
        personId: "<",
        workspaceId: "<",
        workareaId: "<"
      };

    }
  }

  app.component("mrsDischargedDialog", new Component());

}
