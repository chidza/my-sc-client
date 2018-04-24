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
      console.log("reception.management.identification.add");
      this.state.go("reception.management.identification-add", { personId: this.personId });
    }

    onEdit = (id: string) => {

      console.log("id+ id" + id);
      this.state.go("reception.management.identification-edit", { personId: this.personId, id: id });
    }
  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/identification/identification.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementIdentification", new Component());

}
