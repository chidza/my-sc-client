namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPreviousPregnancyDialog extends ng.IController {
    closed: () => void;
    saved: (birthDetails: Object) => void;
  }

  class Controller implements IPreviousPregnancyDialog {
    personId: string;
    deliveryId: string;
    ancId: string;
    stage: string;
    public saved: (birthDetails: Object) => void;
    public closed: () => void;
    datePickerOpenStatus = {};
    deliveryTypes: Array<data.IDeliveryType>;
    childId: string;
    pregnancy = {} as data.IPastAncHistory;
    pregnancyHistoryDetails = {} as data.IPastAncHistoryDetails;
    delivery = {} as data.IDelivery;
    anc = {} as data.IAnc;

    static $inject = ["AncService", "DeliveryTypeService", "DeliveryService"];
    constructor(private ancService: data.IAncService,
      private deliveryTypesService: data.IDeliveryTypeService,
      private deliveryService: data.IDeliveryService
    ) {

    }

    $onInit = () => {
      this.deliveryTypesService.query("").then((response) => {
        this.deliveryTypes = response;
      });
    }


    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }



    init = () => {
      if (this.stage === "PNC") {
        this.pregnancy.outcome = "DELIVERED";
      }

      if (this.ancId) {
        this.ancService.get(this.ancId).then((anc) => {
          this.anc = anc;
          this.pregnancy.deliveryDate = this.anc.date;
          this.pregnancy.outcome = this.anc.outcome;
          this.pregnancyHistoryDetails.id = anc.id;
          if (this.anc.deliveryId) {
            this.deliveryService.get(this.anc.deliveryId).then((delivery) => {
              this.delivery = delivery;
            });
          }
        });
      }
    }

    save = () => {
      if (this.anc.id) {
        this.anc.date = this.pregnancy.deliveryDate;
        this.anc.outcome = this.pregnancy.outcome;
        this.ancService.update(this.anc).then((response) => {
          this.anc = response;
          if (this.anc.deliveryId) {
            this.delivery.date = this.pregnancy.deliveryDate;
            this.deliveryService.update(this.delivery).then((response) => {
              this.saved({ deliveryId: this.pregnancyHistoryDetails.deliveryId, ancId: this.pregnancyHistoryDetails.id });
            });
          } else {
            this.saved({ deliveryId: this.pregnancyHistoryDetails.deliveryId, ancId: this.pregnancyHistoryDetails.id });
          }

        });
      } else {
        if (this.pregnancy.deliveryDate && this.pregnancy.outcome) {
          this.pregnancy.personId = this.personId;
          this.ancService.savePastAnc(this.pregnancy).then((response) => {
            this.pregnancyHistoryDetails = response;
            this.saved({ deliveryId: this.pregnancyHistoryDetails.deliveryId, ancId: this.pregnancyHistoryDetails.id });
          });
        }
      }
    }

    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/previous-pregnancy/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        ancId: "<",
        addPerson: "&",
        saved: "&",
        closed: "&",
        stage: "@"
      };

    }
  }

  app.component("mrsPreviousPregnancyDialog", new Component());

}
