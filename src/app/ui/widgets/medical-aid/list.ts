namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IMedicalAidList extends ng.IController {
    addMedicalAid: () => void;
    editMedicalAid: (medicalAidId: Object) => void;
  }

  class Controller implements IMedicalAidList {

    personId: string;
    medicalAid: Array<data.IMedicalAid> = [];
    medicalAidServiceProviders: Array<data.IMedicalAidProvider> = [];
    public addMedicalAid: () => void;
    public editMedicalAid: (medicalAidId: Object) => void;

    static $inject = ["MedicalAidService", "dialogs", "MedicalAidProviderService"];
    constructor(private medicalAidService: data.IMedicalAidService,
      private dialog: ng.dialogservice.IDialogService,
      private medicalAidProviderService: data.IMedicalAidProviderService) {

    }

    init = () => {
      this.medicalAidService.getByPerson(this.personId).then((response) => {
        this.medicalAid = response;
      });

      this.medicalAidProviderService.query().then((response) => {
        this.medicalAidServiceProviders = response;
      });
    }

    getProvider = (id: string) => {
      let result: string;

      if (this.medicalAidServiceProviders) {
        this.medicalAidServiceProviders.forEach((provider) => {
          if (provider.id === id) {
            result = provider.name;
          }
        });
      }
      return result;
    }

    $onInit = () => {
      this.init();
    }

    add = () => {
      this.addMedicalAid();
    }

    edit = (id: string) => {
      this.editMedicalAid({ medicalAidId: id });
    }
    delete = (id: string) => {

      let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

      dlg.result.then((btn) => {
        this.medicalAidService.remove(id).then((response) => {
          this.init();
        });
      }, (error) => {

      });
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/medical-aid/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "addMedicalAid": "&",
        "editMedicalAid": "&",
        "personId": "<"
      };

    }
  }

  app.component("mrsMedicalAidList", new Component());

}