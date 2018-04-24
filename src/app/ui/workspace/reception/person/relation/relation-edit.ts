namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
    id: string;
  }

  class Controller implements ng.IController {
    personId: string;
    personRelationId: string;
    memberId: string;

    static $inject = ["RelationService", "$state", "$stateParams"];
    constructor(private relationService: data.IRelationService,
      private state: ng.ui.IStateService,
      params: IParams) {
      this.personId = params.personId;
      this.personRelationId = params.id;
    }

    $onInit = (): void => {

      this.relationService.get(this.personRelationId).then((response) => {
        this.memberId = response.memberId;
      });

    }

    onClose = () => {
      this.state.go("reception.management.relation", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/relation/relation-edit.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementRelationEdit", new Component());

}
