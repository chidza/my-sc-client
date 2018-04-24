namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPhoneDialog extends ng.IController {
    closed: () => void;
    saved: (phoneId: Object) => void;
  }

  class Controller implements IPhoneDialog {
    public closed: () => void;
    public saved: (phoneId: Object) => void;
    encounterId: string;
    personId: string;
    phone = {} as data.IPhone;
    phoneId: string;
    phones: Array<data.IPhone> = [];
    datePickerOpenStatus = {};

    static $inject = ["PhoneService"];
    constructor(private phoneService: data.IPhoneService) {

    }

    $onInit = () => {
      this.phoneService.get(this.phoneId).then((response) => {
        this.phone = response;
        this.phoneId = this.phone.id;
      }, (error) => {
        console.log(error);
      });

      this.phoneService.getByPersonId(this.personId).then((response) => {
        this.phones = response;
      });

    }


    save = () => {
      if (this.phone.id) {
        this.onSave(this.phoneService.update(this.phone));
      }
      else {
        this.phone.personId = this.personId;
        this.onSave(this.phoneService.save(this.phone));
      }
    }

    onSave = (promise: ng.IPromise<data.IPhone>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved({ phoneId: response.id });
        }
      }, () => {
        // error!
      });
    }

    close = () => {
      this.closed();
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/person-phone/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        phoneId: "<",
        personId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsPersonPhoneDialog", new Component());

}