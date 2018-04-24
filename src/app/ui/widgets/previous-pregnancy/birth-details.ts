namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonDialog extends ng.IController {
    closed: () => void;
    selected: (deliveryId: Object) => void;
    addChild: (deliveryId: Object) => void;
    editInfant: (infantId: Object) => void;
  }

  class Controller implements IPersonDialog {

    personId: string;
    person: data.IPerson;
    deliveryTypes: Array<data.IDeliveryType>;
    deliveryId: string;
    public addChild: (deliveryId: Object) => void;
    public closed: () => void;
    public selected: (deliveryId: Object) => void;
    public editInfant: (infantId: Object) => void;
    delivery: data.IDelivery;
    datePickerOpenStatus = {};
    outcome: string;
    refresh: number;
    foetal: Array<data.IInfantPersonList> = [];
    infants: Array<data.IInfantPersonList> = [];

    static $inject = ["PersonService", "DeliveryTypeService", "DeliveryService", "AncService", "InfantService", "dialogs", "$uibModal"];
    constructor(private personService: data.IPersonService,
      private deliveryTypesService: data.IDeliveryTypeService,
      private deliveryService: data.IDeliveryService,
      private ancService: data.IAncService,
      private infantService: data.IInfantService,
      private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService
    ) {

    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    $onInit = () => {
      this.deliveryTypesService.query("").then((response) => {
        this.deliveryTypes = response;
      });
    }

    init = () => {
      this.infants = [];
      this.foetal = [];
      if (this.deliveryId && this.refresh > -1) {
        this.infantService.getByPersonId(this.deliveryId).then((response) => {
          if (response) {
            response.forEach((infant) => {
              if (infant.outcome === "ALIVE") {
                this.infants.push(infant);
              }
              if (infant.outcome === "DEAD") {
                this.foetal.push(infant);
              }
            });
          }
        });

      }

    }

    close = () => {
      this.closed();
    }

    editInfantBirthDetails = (id: string) => {
      console.log("infant id", id);
      this.editInfant({ infantId: id });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/birth-details.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "editInfant": "&",
        "edit": "&",
        "deliveryId": "<",
        refresh: "<"
      };

    }
  }

  app.component("mrsBirthDetails", new Component());

}
