namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {

    pdfUrl: string;
    reportId: string;
    from: string = null;
    to: string = null;
    week: number = null;
    year: number = null;

    static $inject = ["$state", "$stateParams"];
    constructor(private state: ng.ui.IStateService,
      private params: ng.ui.IStateParamsService) {
      this.reportId = params["reportId"];
      this.from = params["from"];
      this.to = params["to"];
      this.week = params["week"];
      this.year = params["year"];
      console.log(params);
    }

    $onInit = (): void => {
      if (this.from.length > 0) {
        this.pdfUrl = mrs.config.Settings.serverResource("api/reports/"
          + this.reportId
          + "?format=pdf&from="
          + this.from
          + "&to="
          + this.to);
      }

      if (this.week > 0) {
        this.pdfUrl = mrs.config.Settings.serverResource("api/reports/weekly/"
          + this.reportId
          + "?format=pdf&week="
          + this.week
          + "&year="
          + this.year);

      }
    }
    close = (): void => {
      this.state.go("reports.overview");
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/reports/viewer/viewer.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
      };
    }

  }

  app.component("mrsReportsViewerLayout", new Component());

}
