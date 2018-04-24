namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonEmailDialog extends ng.IController {
    closed: () => void;
    saved: (emailId: Object) => void;
  }

  class Controller implements IPersonEmailDialog {
    public closed: () => void;
    public saved: (emailId: Object) => void;
    encounterId: string;
    personId: string;
    email = {} as data.IEmail;
    emailId: string;
    emails: Array<data.IEmail> = [];
    datePickerOpenStatus = {};

    static $inject = ["EmailService"];
    constructor(private emailService: data.IEmailService) {

    }

    $onInit = () => {

      this.emailService.get(this.emailId).then((response) => {
        this.email = response;
        this.emailId = this.email.id;
      }, (error) => {
        console.log(error);
      });

      this.emailService.getByPersonId(this.personId).then((response) => {
        this.emails = response;
      });

    }
   save = () => {
      if (this.email.id) {
        this.onSave(this.emailService.update(this.email));
      }
      else {
        this.email.personId = this.personId;
        this.onSave(this.emailService.save(this.email));
      }
    }

    onSave = (promise: ng.IPromise<data.IEmail>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved({ emailId: response.id });
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
      public templateUrl = "app/ui/widgets/person-email/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        emailId: "<",
        personId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsPersonEmailDialog", new Component());

}