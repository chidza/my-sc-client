namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    opdId: string;
    admissionId: string;

    investigations: Array<data.IEncounterInvestigationList> = [];

    static $inject = ["PersonInvestigationService", "$uibModal"];
    constructor(private personInvestigationService: data.IPersonInvestigationService,
      private modal: ng.ui.bootstrap.IModalService) {

    }

    init = () => {

      if (this.opdId) {
        this.personInvestigationService.getForOpd(this.opdId).then((response) => {
          this.investigations = response;

        });
      }

      if (this.admissionId) {
        this.personInvestigationService.getForAdmission(this.admissionId).then((response) => {
          this.investigations = response;
        });
      }



    }




    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    preview = (id: string): void => {
      // console.log("Preview: ", id);
      // this.modal.open({
      //   template: "I C U"
      // });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/overview/investigation/encounter.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        opdId: "<",
        admissionId: "<"
      };

    }
  }

  app.component("mrsPersonEncounterInvestigationList", new Component());

}