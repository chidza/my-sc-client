namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IReceptionSearch extends ng.IController {
    onRegister(): void;
    onSelected(personId: string): void;
  }

  class Controller implements IReceptionSearch {

    personId: string;

    static $inject = ["$state"];
    constructor(private state: ng.ui.IStateService) {

    }

    onRegister = (): void => {
      this.state.go("reception.new");
    }

    onSelected = (personId: string): void => {
      this.personId = personId;
    }

    fileManagement = (): void => {
      this.state.go("reception.management.overview", { personId: this.personId });
    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/reception/search.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsReceptionSearch", new Component());

}
