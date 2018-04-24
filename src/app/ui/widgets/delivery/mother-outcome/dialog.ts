namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IDeliverySummaryDialog extends ng.IController {
    closed: () => void;
    saved: (deliverySummaryId: Object) => void;
  }

  class Controller implements IDeliverySummaryDialog {

    deliverySummaryId: string;
    art: data.IDelivery;
    deliverySummary = {} as data.IDeliverySummary;
    weight: string = mrs.config.Settings.SiteSettings.WEIGHT_ID;
    height: string = mrs.config.Settings.SiteSettings.HEIGHT_ID;
    temp: string = mrs.config.Settings.SiteSettings.TEMPERATURE_ID;
    bp: string = mrs.config.Settings.SiteSettings.BP_ID;
    rr: string = mrs.config.Settings.SiteSettings.RR_ID;
    pulse: string = mrs.config.Settings.SiteSettings.PULSE_ID;
    personId: string;
    encounterId: string;
    workspaceId: string;
    public closed: () => void;
    public saved: (deliverySummaryId: Object) => void;

    static $inject = ["DeliverySummaryService", "PersonVitalService", "SiteSettingService"];
    constructor(private deliverySummaryService: data.IDeliverySummaryService,
      private personVitalService: data.IPersonVitalService,
      private siteSettingService: data.ISiteSettingService
    ) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      if (this.deliverySummaryId) {

        this.deliverySummaryService.get(this.deliverySummaryId).then((response) => {
          this.deliverySummary = response;
        }, (error) => {
          console.log(error);
        });
      }
    }

    updateVital = (id: string, vital: string) => {
      console.log(vital);
      if (vital === mrs.config.Settings.SiteSettings.TEMPERATURE_ID) {
        this.deliverySummary.tempAfterDeliveryId = id;
        this.save();
      }

      if (vital === "BP_AFTER_DEL") {
        this.deliverySummary.bpAfterDeliveryId = id;
        this.save();
      }
      if (vital === "BP_AFTER_DEL") {
        this.deliverySummary.bpAfterDeliveryId = id;
        this.save();
      }


      if (vital === "BP_AFTER_HR") {
        this.deliverySummary.bpAfterHrDeliveryId = id;
        this.save();
      }

      if (vital === "PULSE_AFTER_DEL") {
        this.deliverySummary.pulseAfterDeliveryId = id;
        this.save();
      }
      if (vital === "PULSE_AFTER_HR") {
        this.deliverySummary.pulseAfterHrDeliveryId = id;
        this.save();
      }

    }

    save = () => {
      if (this.deliverySummary.id !== "") {
        this.onSave(this.deliverySummaryService.update(this.deliverySummary));
      }
      else {
        this.onSave(this.deliverySummaryService.save(this.deliverySummary));
      }
    }

    onSave = (promise: ng.IPromise<data.IDeliverySummary>) => {
      promise.then((response) => {
        console.log(response);
        this.deliverySummary = response;
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
      public templateUrl = "app/ui/widgets/delivery/mother-outcome/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        deliverySummaryId: "<",
        encounterId: "<",
        personId: "<",
        workspaceId: "<"
      };

    }
  }

  app.component("mrsMotherOutcomeDialog", new Component());

}