namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IParams extends ng.ui.IStateParamsService {
    personId: string;
  }

  class Controller implements ng.IController {

    personId: string;

    static $inject = ["$state", "$stateParams", "AncService"];
    constructor(private state: ng.ui.IStateService,
      stateParams: IParams,
      private ancService: data.IAncService) {
      this.personId = stateParams.personId;
    }

    onSave = () => {
      this.state.go("consultation.management.ancregistration.enrollment");
    }

    onClose = () => {
      this.ancService.current(this.personId).then((response) => {
        this.state.go("consultation.management.ancregistration.enrollment");
      }, () => {
        this.state.go("consultation.management.anc.overview");
      });
    }

  }


  class Component implements ng.IComponentOptions {

    constructor(
      public templateUrl = "app/ui/workspace/consultation/anc/registration/enrollment/edit.html",
      public controllerAs = "vm",
      public controller = Controller) { }

  }

  app.component("mrsConsultationPatientAncEdit", new Component());

}
