namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {

    reportGroup: string;

    groups: Array<string> = [];

    report: data.IReport;

    reports: Array<data.IReport> = [];

    months: Array<any> = [];

    weeks: Array<any> = [];

    month: string = (moment().month() + 1).toString();
    year: number = moment().year();
    week: number;


    static $inject = ["$state", "$stateParams", "ReportService"];
    constructor(private state: ng.ui.IStateService,
      private params: ng.ui.IStateParamsService,
      private reportService: data.IReportService) {
    }


    $onInit = (): void => {

      for (let i = 0; i < 12; i++) {
        this.months.push({
          id: (i + 1).toString(),
          name: moment().month(i).format("MMMM")
        });
      }

      for (let i = 0; i < 52; i++) {
        this.weeks.push({
          id: (i + 1).toString(),
          name: "Week " + (i + 1)
        });
      }


      this.reportService.getReportGroups().then((response) => {
        this.groups = response;
      });
    }

    reportGroupChange = (): void => {
      this.reportService.getGroupReports(this.reportGroup).then((response) => {
        this.reports = response;
      });
    }

    generate = () => {
      if (this.report.frequency === "MONTHLY") {
        this.state.go("reports.viewer", { reportId: this.report.id, from: this.getFrom(), to: this.getTo(), week: null, year: null });
      }
      if (this.report.frequency === "WEEKLY") {
        this.state.go("reports.viewer", { reportId: this.report.id, from: null, to: null, week: this.week, year: this.year });
      }
    }

    getFrom = (): string => {
      return moment([this.year, parseInt(this.month) - 1]).format("YYYY-MM-DD");
    }

    getTo = (): string => {
      let from: moment.Moment = moment(this.getFrom());
      return from.date(from.daysInMonth()).format("YYYY-MM-DD");
    }

    isMissingInfo = (): boolean => {
      // to add validation rules for other formarts other than MONTHLY
      if (angular.isDefined(this.report)) {
        switch (this.report.frequency) {
          case "MONTHLY":
            return false;
          case "WEEKLY":
            return false;
          case "DAILY":
            return true;
          case "QUARTERLY":
            return true;
          default:
            return true;
        }
      } else {
        return true;
      }
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/workspace/reports/overview/overview.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
      };
    }

  }

  app.component("mrsReportsOverviewLayout", new Component());

}
