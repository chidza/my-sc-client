namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterComplaintList extends ng.IController {
    addComplaint: () => void;
    editComplaint: (encounterComplaintId: Object) => void;
  }

  class Controller implements IEncounterComplaintList {

    encounterId: string;
    currentUser: string;
    workspaceId: string;
    personId: string;

    list: Array<data.IEncounterComplaintList> = [];

    public addComplaint: () => void;
    public editComplaint: (encounterComplaintId: Object) => void;

    static $inject = ["EncounterComplaintService", "dialogs", "PersonComplaintService", "ConsultationService", "Principal"];
    constructor(private encounterComplaintService: data.IEncounterComplaintService,
      private dialog: ng.dialogservice.IDialogService,
      private personComplaintService: data.IPersonComplaintService,
      private consultationService: data.IConsultationService,
      private principal: security.IPrincipal
    ) {

    }

    $onInit = (): void => {

      this.principal.identity().then((response) => {
        this.currentUser = response.login;
      });

      this.consultationService.getComplaints(this.workspaceId, this.personId).then((response) => {
        this.list = response;
      
      });
    }

    disableControls = (model: data.IEncounterComplaintList) => {

      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;
    }

    add = () => {
      this.addComplaint();
    }

    edit = (model: data.IEncounterComplaintList) => {
      this.editComplaint({ id: model.encounterPersonComplaintId });
    }

    delete = (model: data.IEncounterComplaintList) => {
      let msg = "You are about to delete patient complaint. Are you sure you want to proceed?";

      let dlg = this.dialog.confirm("Confirm", msg);

      dlg.result.then(() => {

        let id = model.encounterPersonComplaintId;

        this.encounterComplaintService.remove(id).then((response) => {
          this.list.splice(this.list.indexOf(model), 1);
        }, () => {
          this.dialog.error("Deletion Error", "Complaint could not be removed. Please try again");
        });

      }, () => { });
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-complaint/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addComplaint: "&",
        editComplaint: "&",
        encounterId: "<",
        workspaceId: "<",
        personId: "<"
      };

    }
  }

  app.component("mrsEncounterComplaintList", new Component());

}
