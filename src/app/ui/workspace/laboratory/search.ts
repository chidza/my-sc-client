namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ILaboratorySearch extends ng.IController {
    onRegister(): void;
    onSelected(personId: string): void;
  }

  class Controller implements ILaboratorySearch {

    personId: string;

    static $inject = ["$state"];
    constructor(private state: ng.ui.IStateService) {

    }

    onRegister = (): void => {
      this.state.go("laboratory.new");
    }

    onSelected = (personId: string): void => {
      this.personId = personId;
    }

    onOpenFile = (labInvestigationId: string): void => {
      if (labInvestigationId) {
        this.state.go("laboratory.edit", { labInvestigationId: labInvestigationId });
      }

    }

  }

  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/laboratory/search.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsLaboratorySearch", new Component());

}
