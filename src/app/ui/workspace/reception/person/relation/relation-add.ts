namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
    id: string;
  }

  class Controller implements ng.IController {
    personId: string;
    memberId: string;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService, params: IParams) {
      this.personId = params.personId;
      this.memberId = params.id;
    }

    onClose = () => {
      this.state.go("reception.management.relation", { personId: this.personId });
    }

    onChange = () => {
      this.state.go("reception.management.relation-select", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/relation/relation-add.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementRelationAdd", new Component());

}
