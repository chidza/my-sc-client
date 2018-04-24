namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
  }

  class Controller implements ng.IController {
    personId: string;

    person: data.IPerson;

    static $inject = ["PersonService", "$stateParams"];
    constructor(private personService: data.IPersonService, stateParams: IParams) {
      this.personId = stateParams.personId;
    }

    $onInit = (): void => {

      this.personService.get(this.personId).then((response) => {
        this.person = response;
      });

    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/person/overview/overview.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionFileManagementOverview", new Component());

}
