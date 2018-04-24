namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonDialog extends ng.IController {
    saved: () => void;
    close: () => void;
  }

  class Controller implements IPersonDialog {

    personId: string;
    childId: string;
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
      console.log(this.childId);
      if (this.childId) {
        this.personService.get(this.childId).then((response) => {
          this.person = response;
          this.infant.personId = this.childId;
          this.infant.deliveryId = this.deliveryId;
          this.infant.apgar1 = 0;
          this.infant.time = new Date(moment(this.person.birthdate).format("YYYY-MM-DD 00:00:00"));
          this.infant.outcome = "ALIVE";
        });
      }

    }

    save = () => {
      if (this.infant.id) {
        this.infantService.update(this.infant).then((response) => {
          this.infant = response;
          this.saved();
        }, (error) => {
          console.log(error);
        });
      } else {
        if (this.infant.weight && this.infant.deliveryMethod) {
          console.log(this.infant, "this.infant");
          this.infantService.save(this.infant).then((response) => {
            this.saved();
            this.infant = response;
          }, (error) => {
            console.log(error);
          });
        }
      }
    }

    exit = () => {
      this.close();
    }

    update = () => {
      if (this.infant.id) {
        this.infantService.update(this.infant).then((response) => {
          this.infant = response;
          this.saved();
        }, (error) => {
          console.log(error);
        });
      }

    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/birth-details-add.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "saved": "&",
        "close": "&",
        "personId": "<",
        "childId": "<",
        "deliveryId": "<"
      };

    }
  }

  app.component("mrsBirthDetailsAdd", new Component());

}
