namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {
    personId: string;
    vitals: Array<data.IEncounterVitalList> = [];
    dtOptions: any;
    dtColumns: any;
    currentPage: number = 0;
    reload: number;

    static $inject = ["PersonVitalService", "DTOptionsBuilder", "DTColumnBuilder"];
    constructor(private personVitalService: data.IPersonVitalService,
      private options: any,
      private columns: any) {

    }

    cb = (data: any, callback: any, settings: any) => {
      let sortOrder = [this.dtColumns[data.order[0].column].mData + "," + data.order[0].dir];
      this.currentPage = +(data.start / data.length);
      this.personVitalService.getPersonHistory(this.personId, {
        page: this.currentPage, size: data.length, sort: sortOrder
      }).then((response: any) => {
        let result = {
          "draw": data.draw,
          "recordsTotal": response.totalElements,
          "recordsFiltered": response.totalElements,
          "data": response.content
        };
        callback(result);
      });
    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      if (this.reload > 1)
        this.init();
    }
    init = () => {
      angular.element("#dt").DataTable().ajax.reload(function (data: any) {
      });
    }
    $onInit = () => {
      this.dtOptions = this.options.newOptions()
        .withOption("ajax", this.cb)
        .withDataProp("data")
        .withOption("serverSide", true)
        .withOption("processing", true)
        .withOption("columnDefs", [{
          "targets": [1, 2],
          "orderable": false
        }])
        .withOption("order", [[0, "desc"]])
        .withPaginationType("full_numbers")
        .withOption("dom", `<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>`)
        .withBootstrap();
      this.dtColumns = [
        this.columns.newColumn("date").withTitle("Date"),
        this.columns.newColumn("name").withTitle("Name"),
        this.columns.newColumn("value").withTitle("Value")
      ];
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/overview/vital/history.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        reload: "<"
      };

    }
  }

  app.component("mrsPersonHistoryVitalList", new Component());

}