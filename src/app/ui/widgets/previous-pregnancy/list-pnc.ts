namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IAncList extends ng.IController {
    addAnc: () => void;
    details: (deliveryId: Object) => void;
    useDelivery: (deliveryId: Object) => void;
    editAnc: (ancId: Object) => void;
  }

  class Controller implements IAncList {

    personId: string;
    previousAncs: Array<data.IAncList> = [];
    deliveries: Array<data.IDelivery> = [];
    public addAnc: () => void;
    details: (deliveryId: Object) => void;
    useDelivery: (deliveryId: Object) => void;
    editAnc: (deliveryId: Object) => void;
    ancInformation: data.IInformation;

    static $inject = ["AncService", "dialogs", "InfantService", "DeliveryService"];
    constructor(private ancService: data.IAncService,
      private dialog: ng.dialogservice.IDialogService,
      private infantService: data.IInfantService,
      private deliveryService: data.IDeliveryService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      if (this.personId) {
        this.deliveryService.getPendingPnc(this.personId).then((response) => {
          this.deliveries = response;
          console.log(this.deliveries);
        });
        this.ancService.getInformation(this.personId).then((response) => {
          this.ancInformation = response;
        });
      }
    }


    add = () => {
      this.addAnc();
    }

    edit = (id: string) => {
      this.ancService.getByDelivery(id).then((response) => {
        this.editAnc({ ancId: response.id });
      });

    }

    use = (id: string): void => {
      this.useDelivery({ deliveryId: id });
    }

    subTime = (deliveryDate: any) => {
      console.log("deliveryDate");
      console.log(deliveryDate);
      let startTime = moment(deliveryDate, "YYYY-MM-DDTHH:mm:ss");
      let endTime = moment(new Date());
      let duration = endTime.diff(startTime, "months");
      console.log("duration");
       console.log(duration);
      return duration;
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/list-pnc.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "addAnc": "&",
        "personId": "<",
        "details": "&",
        "editAnc": "&",
        "useDelivery": "&"
      };

    }
  }

  app.component("mrsPreviousPncList", new Component());

}
