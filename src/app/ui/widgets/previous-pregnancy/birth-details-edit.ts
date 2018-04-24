namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonDialog extends ng.IController {
    saved: () => void;
    close: () => void;
  }

  class Controller implements IPersonDialog {

    personId: string;
    infantId: string;
    deliveryId: string;
    person = {} as data.IPerson;
    deliveryTypes: Array<data.IDeliveryType>;
    public saved: () => void;
    public close: () => void;
    previousPregnancy: data.IPreviousPregnancy;
    infant = {} as data.IInfant;
    static $inject = ["PersonService", "DeliveryTypeService", "InfantService", "dialogs"];
    constructor(private personService: data.IPersonService,
      private deliveryTypesService: data.IDeliveryTypeService,
      private infantService: data.IInfantService,
      private dialog: ng.dialogservice.IDialogService
    ) { }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      
      if (this.infantId) {
        this.infantService.get(this.infantId).then((response)=>{
          this.infant = response;
          this.personService.get(response.personId).then((response) => {
            this.person = response;
          });
        });
      }

    }

    save = () => {
      if (this.infant.id) {
        this.infantService.update(this.infant).then((response) => {
          this.infant = response;
          this.close();
        }, (error) => {
          console.log(error);
        });
      } else {
        console.log("infant id not found");
      }
    }

    exit = () => {
      this.close();
    }

    update = () => {
      if (this.infant.id) {
        this.infantService.update(this.infant).then((response) => {
          this.infant = response;
        }, (error) => {
          console.log(error);
        });
      }

    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/birth-details-edit.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "saved": "&",
        "close": "&",
        "infantId": "<"
      };

    }
  }

  app.component("mrsBirthDetailsEdit", new Component());

}
