namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ISampleSelect extends ng.IController {
    selectSample: (sampleId: Object) => void;
  }

  class Controller implements ISampleSelect {

    encounterId: string;
    samples: Array<data.ISample> = [];
    dtOptions: any;
    dtColumns: any;
    currentPage: number = 0;

    public selectSample: (sampleId: Object) => void;

    static $inject = ["SampleService", "DTOptionsBuilder", "DTColumnBuilder"];
    constructor(private sampleService: data.ISampleService,
      private options: any,
      private columns: any) {
    }

    cb = (data: any, callback: any, settings: any) => {
      let sortOrder = [this.dtColumns[data.order[0].column].mData + "," + data.order[0].dir];
      this.currentPage = +(data.start / data.length);
      this.sampleService.query(data.search.value, {
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

    $onInit = () => {
      this.dtOptions = this.options.newOptions()
        .withOption("ajax", this.cb)
        .withDataProp("data")
        .withOption("serverSide", true)
        .withOption("processing", true)
        .withOption("order", [[0, "desc"]])
        .withOption("rowCallback", this.selectItem)
        .withPaginationType("full_numbers")
        .withOption("dom", `<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>`)
        .withBootstrap();
      this.dtColumns = [
        this.columns.newColumn("name").withTitle("Name"),
        this.columns.newColumn(null).withTitle("Action").notSortable()
          .renderWith(this.actionsHtml)
      ];

    }


    selectItem = (nRow: any, aData: any, iDisplayIndex: any, iDisplayIndexFull: any) => {
      let self = this;
      $("td", nRow).unbind("click");
      $("td", nRow).bind("click", function () {
        self.selected(aData);
      });
      return nRow;
    }

    actionsHtml = (data: any, type: any, full: any, meta: any) => {
      return `<button class="btn btn-primary pull-right"> Select </button>`;
    }

    selected = (row: any) => {
      console.log("row", row);
      this.index += 1;

      console.log(this.selectSample);
      this.selectSample({ sampleId: row.id });

    }

    index: number = 0;

    up = () => {
      console.log("gione ..");
      // this.selected({});
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/sample/select.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "selectSample": "&"
      };

    }
  }

  app.component("mrsSampleSelect", new Component());

}
