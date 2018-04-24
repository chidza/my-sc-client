namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterVitalList extends ng.IController {
    addVital: () => void;
    editVital: (encounterVitalId: Object) => void;
    deleteVital: (encounterVitalId: Object) => void;
    refreshed: () => void;
  }

  class Controller implements IEncounterVitalList {

    encounterId: string;
    vitalId: string;
    list: Array<data.IEncounterVitalList> = [];
    workspaceId: string;
    personId: string;
    currentUser: string;

    public addVital: () => void;
    public refreshed: () => void;
    public editVital: (encounterVitalId: Object) => void;
    public deleteVital: (encounterVitalId: Object) => void;
    public selected: (personVitalId: Object) => void;

    static $inject = ["EncounterVitalService", "dialogs", "PersonVitalService"
      , "ConsultationService", "Principal"];
    constructor(private encounterVitalService: data.IEncounterVitalService,
      private dialog: ng.dialogservice.IDialogService,
      private personVitalService: data.IPersonVitalService,
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

      this.consultationService.getVitals(this.workspaceId, this.personId).then((response) => {
        console.log(response);
        this.list = response;
      });

    }

    disableControls = (model: data.IEncounterVitalList) => {
      return model.createdBy !== this.currentUser || model.encounterId !== this.encounterId;

    }

    add = () => {
      console.log("adding button clicked");
      this.addVital();
    }

    edit = (model: data.IEncounterVitalList) => {

      this.editVital({ id: model.encounterVitalId });
    }

    deleting = (model: data.IEncounterVitalList) => {
      this.deleteVital({ id: model.personVitalId });
    }

    delete = (model: data.IEncounterVitalList) => {
      let msg = "You are about to delete patient vital.Are you sure you want to proceed?";

      let dlg = this.dialog.confirm("Confirm", msg);

      dlg.result.then(() => {

        let id = model.encounterVitalId;

        console.log("about to call deleting method");
        console.log(model);
        this.deleting(model);

        this.encounterVitalService.remove(id).then((response) => {
          this.list.splice(this.list.indexOf(model), 1);
          this.refreshed();

        }, () => {
          this.dialog.error("deletion Error", "Vital could not be removed");

        });

      }, () => {

      });

    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-vital/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addVital: "&",
        editVital: "&",
        deleteVital: "&",
        workspaceId: "<",
        personId: "<",
        vitalId: "<",
        encounterId: "<",
        refreshed: "&",
        refresh: "<",
      };

    }
  }

  app.component("mrsEncounterVitalList", new Component());

}