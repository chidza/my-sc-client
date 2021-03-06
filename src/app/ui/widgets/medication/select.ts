namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IMedicationList extends ng.IController {
    selectMedication: (medicationId: Object) => void;
     closed: () => void;
  }

  class Controller implements IMedicationList {

    encounterId: string;
    medications: Array<data.IDrugName> = [];
    dtOptions: any;
    dtColumns: any;
    currentPage: number = 0;

    v = this;

    public selectMedication: (medicationId: Object) => void;
     public closed: () => void;

    static $inject = ["DrugNameService", "DTOptionsBuilder", "DTColumnBuilder", "$rootScope"];
    constructor(private DrugNameService: data.IDrugNameService,
      private options: any,
      private columns: any,
      private rootScope: ng.IRootScopeService) {
    }

    cb = (data: any, callback: any, settings: any) => {
      let sortOrder = [this.dtColumns[data.order[0].column].mData + "," + data.order[0].dir];
      this.currentPage = +(data.start / data.length);
      this.DrugNameService.query(data.search.value, {
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
        this.columns.newColumn("code").withTitle("Code"),
        this.columns.newColumn("name").withTitle("Name"),
        this.columns.newColumn(null).withTitle("Action").notSortable()
          .renderWith(this.actionsHtml)
      ];

    }
    close = () => {
      console.log("Ndapinda....................");
            this.closed();
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
      return `<button class="btn btn-primary"> Select </button>`;
    }

    selected = (row: any) => {
      this.selectMedication({ medicationId: row.id });
      this.rootScope.$apply();
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/medication/select.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "selectMedication": "&",
         "closed": "&"
      };

    }
  }

  app.component("mrsMedicationSelect", new Component());

}
