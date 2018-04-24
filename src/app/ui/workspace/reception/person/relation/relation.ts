namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
  }

  class Controller implements ng.IController {
    personId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService, params: IParams) {
      this.personId = params.personId;
    }

    onAdd = () => {
      this.state.go("reception.management.relation-select", { personId: this.personId });
    }

    onEdit = (id: string) => {
      this.state.go("reception.management.relation-edit", { personId: this.personId, id: id });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/relation/relation.html",
      public controllerAs = "vm",
      public controller = Controller) { }
  }

  app.component("mrsReceptionFileManagementRelation", new Component());

}
