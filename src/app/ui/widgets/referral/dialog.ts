namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IReferralDialog extends ng.IController {
    closed: () => void;
    saved: () => void;
  }

  class Controller implements IReferralDialog {
    reasonId: string;
    referralId: string;
    facilityId: string;
    encounterId: string;
    referral = {} as data.IReferral;
    referrals: Array<data.IReferral> = [];
    referralReasons: Array<data.IReferralReason> = [];
    facilities: data.IPageReponse<data.IFacility>;
    facilityList: Array<data.IFacility> = [];
    facility: string = "";

    public saved: () => void;

    public closed: () => void;



    static $inject = ["ReferralService", "ReferralReasonService", "FacilityService"];
    constructor(private referralService: data.IReferralService,
      private referralReasonService: data.IReferralReasonService,
      private facilityService: data.IFacilityService

    ) {

    }

    $onInit = () => {
      this.referralService.query("").then((response) => {
        this.referrals = response;

      });
      this.referralReasonService.query("").then((response) => {
        this.referralReasons = response;

      });

    }

    /* getFacilitylName = (facilityId: any) => {
      let value: any;
      for (let response of this.facilities) {

        if (response.id === facilityId) {
          value = response.name;
        }
      }
      return value;
    } */

    getReferralReasonlName = (reasonId: any) => {
      let value: any;
      for (let response of this.referralReasons) {

        if (response.id === reasonId) {
          value = response.name;
        }
      }
      return value;
    }
    save = () => {
      if (this.referral.id) {
        this.onSave(this.referralService.update(this.referral));
      }
      else {
        this.referral.encounterId = this.encounterId;
        this.onSave(this.referralService.save(this.referral));

      }
    }
    onSave = (promise: ng.IPromise<data.IReferral>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved();
        }
      }, () => {
      });
    }

    close = () => {
      this.closed();
    }

    getFacilityId = (facility: any): void => {
      this.referral.facilityId = facility.split(" ").pop();

    }

    getFacilities = (text: string): Array<data.IFacility> => {
      this.facilityService.query(text).then((response) => {
        this.facilityList = response.content;
      });
      return this.facilityList;
    }



  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/referral/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        encounterId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsReferralDialog", new Component());

}
