namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IAncList extends ng.IController {
    addAnc: () => void;
    details: (deliveryId: Object) => void;
    editAnc: (ancId: Object) => void;
  }

  class Controller implements IAncList {

    personId: string;
    previousAncs: Array<data.IAncList> = [];
    deliveryId: string;

    public addAnc: () => void;
    details: (deliveryId: Object) => void;
    editAnc: (deliveryId: Object) => void;
    ancInformation: data.IInformation;

    static $inject = ["AncService", "dialogs", "InfantService"];
    constructor(private ancService: data.IAncService,
      private dialog: ng.dialogservice.IDialogService,
      private infantService: data.IInfantService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      if (this.personId) {
        console.log("delivery id", this.deliveryId);
        this.infantService.getAncsDeliveryInfanatsByPersonId(this.personId).then((response) => {
          this.previousAncs = response;
          console.log(this.previousAncs);
        });

        this.ancService.getInformation(this.personId).then((response) => {
          this.ancInformation = response;
        });
      }
    }


    add = () => {
      this.addAnc();
    }

    edit = (id: String) => {
      this.editAnc({ ancId: id });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "addAnc": "&",
        "personId": "<",
        "details": "&",
        "editAnc": "&",
        "deliveryId": "<"
      };

    }
  }

  app.component("mrsPreviousAncList", new Component());

}
