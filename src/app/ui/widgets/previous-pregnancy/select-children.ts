namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPreviousPregnancyDialog extends ng.IController {
    closed: () => void;
    saved: (birthDetails: Object) => void;
    addPerson: () => void;
    addToDelivery: (childId: Object) => void;
    addDeathOutcome: (childId: Object) => void;
  }

  class Controller implements IPreviousPregnancyDialog {
    personId: string;
    deliveryId: string;
    relations: Array<data.IRelationList>;
    public saved: (birthDetails: Object) => void;
    public addToDelivery: (childId: Object) => void;
    public closed: () => void;
    addDeathOutcome: (childId: Object) => void;
    public addPerson: () => void;

    childId: string;
    hide: boolean;
    static $inject = ["RelationService"];
    constructor(private relationService: data.IRelationService
    ) {

    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      this.hide = true;
      console.log(this.personId, "select children");
      console.log(this.deliveryId, "deliveryId in select children");
      this.relationService.fetch(this.personId).then((response) => {
        this.relations = response;
        console.log(this.relations);
      });

    }

    add = () => {
      this.addPerson();
    }

    addDeath = () => {
      this.addDeathOutcome({childId: -1});
    }

    save = () => {
      this.saved({});
      console.log("sending data .....");
    }


    close = () => {
      this.closed();
    }

    selectChild = () => {
      console.log("child ID to send", this.childId);
      this.addToDelivery({ childId: this.childId });
    }

    addChildDetails = (child: any) => {
      this.childId = child.memberId;
      console.log(this.childId);
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/select-children.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        childId: "<",
        deliveryId: "<",
        personId: "<",
        addPerson: "&",
        saved: "&",
        closed: "&",
        addToDelivery: "&",
        addDeathOutcome: "&"
      };

    }
  }

  app.component("mrsSelectChildren", new Component());

}
