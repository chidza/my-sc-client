namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleContactDetail extends ng.IController {

  }

  class Controller implements IPharmacyPeopleContactDetail {

    personId: string;
    addressId: string;
    personAddress: data.IPersonAddress;
    labourSummaryId: string;
    $router: any;

    static $inject = ["PersonAddressService", "dialogs"];
    constructor(private personAddressService: data.IPersonAddressService,
      private dialog: ng.dialogservice.IDialogService) {

    }

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
    }


    onAdd = () => {
            this.$router.navigate(["PharmacyPeopleContactDetailAddressAdd", { personId: this.personId }]);
        }


    onEdit = (id: string) => {
      this.$router.navigate(["PharmacyPeopleContactDetailAddressEdit", { personId: this.personId, addressId: id}]);
    }

     onAddPhone = () => {
            this.$router.navigate(["PharmacyPeopleContactDetailPhoneAdd", { personId: this.personId }]);
        }


    onEditPhone = (id: string) => {
      this.$router.navigate(["PharmacyPeopleContactDetailPhoneEdit", { personId: this.personId, phoneId: id}]);
    }

    onAddEmail = () => {
            this.$router.navigate(["PharmacyPeopleContactDetailEmailAdd", { personId: this.personId }]);
        }


    onEditEmail = (id: string) => {
      this.$router.navigate(["PharmacyPeopleContactDetailEmailEdit", { personId: this.personId, emailId: id}]);
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/contact-details/contact-details.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };

    }
  }

  app.component("mrsPharmacyPeopleContactDetail", new Component());

}
