namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
  }

  class Controller implements ng.IController {

    personId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService, stateParams: IParams) {
      this.personId = stateParams.personId;
    }

    onAdd = () => {
      this.state.go("reception.management.contactdetail-address-add", { personId: this.personId });
    }

    onEdit = (id: string) => {
      this.state.go("reception.management.contactdetail-address-edit", { personId: this.personId, addressId: id });
    }

    onAddPhone = () => {
      this.state.go("reception.management.contactdetail-phone-add", { personId: this.personId });
    }

    onEditPhone = (id: string) => {
      this.state.go("reception.management.contactdetail-phone-edit", { personId: this.personId, phoneId: id });
    }

    onAddEmail = () => {
      this.state.go("reception.management.contactdetail-email-add", { personId: this.personId });
    }

    onEditEmail = (id: string) => {
      this.state.go("reception.management.contactdetail-email-edit", { personId: this.personId, emailId: id });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/contact-details/contact-details.html",
      public controllerAs = "vm",
      public controller = Controller) { }
  }

  app.component("mrsReceptionFileManagementContactDetail", new Component());

}
