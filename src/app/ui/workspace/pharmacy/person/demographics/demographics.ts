namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPharmacyPeopleDemographics extends ng.IController {

  }

  class Controller implements IPharmacyPeopleDemographics {

    $router: any;
    personId: string;

    static $inject = ["dialogs", "$uibModal"];
    constructor(private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService) {

    }

    $routerOnActivate = (next: any): void => {
      this.personId = next.params.personId;
    }

    edit = (personId: string) => {
      this.$router.navigate(["PharmacyPeopleDemographicsEdit", { personId: personId }]);
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/pharmacy/person/demographics/demographics.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"

      };

    }
  }

  app.component("mrsPharmacyPeopleDemographics", new Component());

}
