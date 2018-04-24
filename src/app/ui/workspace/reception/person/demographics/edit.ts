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

    close = (personId: string) => {
      this.cancel();
    }

    cancel = () => {
      this.state.go("reception.management.demographics", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/demographics/edit.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementDemographicsEdit", new Component());

}
