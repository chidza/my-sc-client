namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IAdmissionDialog extends ng.IController {
    closed: () => void;
    saved: (admissionId: Object) => void;
  }

  class Controller implements IAdmissionDialog {

    admissionId: string;
    admission: data.IAdmission;

    public closed: () => void;
    public saved: (admissionId: Object) => void;

    static $inject = ["AdmissionService"];
    constructor(private admissionService: data.IAdmissionService) {

    }

    $onInit = () => {
      this.admissionService.get(this.admissionId).then((response) => {
        this.admission = response;
      }, (error) => {
        console.log(error);
        if ((angular.isDefined(error.status)) && (error.status === 404)) {
          // not found - initialise variable here
          // this.admission.personId = "";
        } else {
          // serious error!
        }
      });
    }

    save = () => {
      if (this.admission.id > 0) {
        this.onSave(this.admissionService.update(this.admission));
      }
      else {
        this.onSave(this.admissionService.save(this.admission));
      }
    }

    onSave = (promise: ng.IPromise<data.IAdmission>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved({ admissionId: response.id });
        }
      }, () => {
        // error!
      });
    }

    close = () => {
      if (this.closed() != null) {
        this.closed();
      }
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/delivery/history/admission.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        admissionId: "<"
      };

    }
  }

  app.component("mrsAdmissionDialog", new Component());

}
