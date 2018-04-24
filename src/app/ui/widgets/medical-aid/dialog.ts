namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IMedicalAidProviderDialog extends ng.IController {

    saved: () => void;
    closed: () => void;

  }

  class Controller implements IMedicalAidProviderDialog {
    medicalAidId: string;
    personId: string;
    MedicalAidServiceProviders: Array<data.IMedicalAidProvider> = [];
    datePickerOpenStatus = {};
    medicalAid = {} as data.IMedicalAid;
    medicalAids: Array<data.IMedicalAid>;

    public saved: () => void;
    public closed: () => void;

    static $inject = ["PersonService", "MedicalAidProviderService", "MedicalAidService","dialogs"];
    constructor(
      private personService: data.IPersonService,
      private medicalAidProviderService: data.IMedicalAidProviderService,
      private medicalAidService: data.IMedicalAidService,
      private dialog: ng.dialogservice.IDialogService) { }

    $onInit = () => {
      this.medicalAidService.get(this.medicalAidId).then((response) => {
        this.medicalAid = response;
      }, (error) => {
        this.medicalAid.personId = this.personId;
      });

      this.medicalAidProviderService.query().then((response) => {
        this.MedicalAidServiceProviders = response;
      });
    }

// TODO: NEED TO BE TESTED
    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

    save = () => {
      if (moment().diff(this.medicalAid.expirationDate, 'days') < 0) {
        if (this.medicalAid.id != null) {
          this.onSave(this.medicalAidService.update(this.medicalAid));
        }
        else {
          this.onSave(this.medicalAidService.save(this.medicalAid));
        }
      }
      else {
        this.dialog.notify("Expiry Date", "Expiry date cannot be in the past");
        console.log("notify its in the past");

      }
    }

    close = () => {
      this.closed();
    }

    onSave = (promise: ng.IPromise<data.IMedicalAid>) => {
      promise.then((response) => {
        this.saved();
      }, () => {

      });
    }
  }
  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/medical-aid/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        medicalAidId: "<",
        personId: "<",
        "saved": "&",
        "closed": "&",
      };

    }
  }

  app.component("mrsMedicalAidDialog", new Component());

}
