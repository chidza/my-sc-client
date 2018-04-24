namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IInvestigationSelect extends ng.IController {

    selectInvestigation: (id: Object) => void;
  }

  class Controller implements IInvestigationSelect {

    sampleId: string;
    testId: string;
    samples: Array<data.ISample> = [];
    tests: Array<data.ILabTest> = [];
    investigationId: string = "";

    public selectInvestigation: (personId: Object) => void;

    static $inject = ["SampleService"];
    constructor(private sampleSerivce: data.ISampleService) {

    }

    $onInit = () => {
      this.sampleSerivce.query().then((response) => {
        this.samples = response.content;
      });
    }

    sampeTests = () => {
      this.sampleSerivce.sampleTests(this.sampleId).then((response) => {
        this.tests = response;
      });
    }

    getInvestigation = () => {
      this.sampleSerivce.investigation(this.sampleId, this.testId).then((response) => {
        this.investigationId = response.id;
      }, () => {
        this.investigationId = "";
      });
    }

    onSelected = () => {
      this.selectInvestigation({ id: this.investigationId });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/investigation/select.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        selectInvestigation: "&"
      };

    }
  }

  app.component("mrsInvestigationSelect", new Component());

}
