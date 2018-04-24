namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonIdDialog extends ng.IController {
    closed: () => void;
    saved: (personIdData: Object) => void;

  }

  class Controller implements IPersonIdDialog {
    personId: string;
    personIdentifiers: Array<data.IPersonIdentifier> = [];
    personIdDataId: data.IPersonId;
    personIdData = {} as data.IPersonId;
    id: string;

    public closed: () => void;
    public saved: (personId: Object) => void;

    static $inject = ["PersonIdService", "PersonIdentifierService"];
    constructor(
      private personIdService: data.IPersonIdService,
      private personIdentifierService: data.IPersonIdentifierService) {
    }



    $onInit = () => {

      console.log(this.id);
      this.personIdentifierService.query("").then((response) => {
        this.personIdentifiers = response;
      });

      this.personIdService.get(this.id).then((response) => {
        this.personIdData = response;

      });
    }


    close = () => {
      this.closed();
    }
    save = () => {


      if (this.personIdData.id) {
        this.onSave(this.personIdService.update(this.personIdData));
      }
      else {
        this.personIdData.personId = this.personId;

        this.onSave(this.personIdService.save(this.personIdData));
      }
    }

    onSave = (promise: ng.IPromise<data.IPersonId>) => {
      promise.then((response) => {
        this.saved({ personIdDataId: response.id });
      }, () => {

      });
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/person-id/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        closed: "&",
        personIdDataId: "<",
        "saved": "&",
        id: "<"
      };

    }
  }

  app.component("mrsPersonIdDialog", new Component());

}
