namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonSearch extends ng.IController {
        selected: (deliveryId: Object) => void;
    }

    class Controller implements IPersonSearch {

        public selected: (deliveryId: Object) => void;

        searchText: string;
        dtOptions: any;
        dtColumns: any;
        currentPage: number = 0;

        static $inject = ["PartogramService", "DTOptionsBuilder", "DTColumnBuilder", "$rootScope", "DateUtils"];
        constructor(private partogramService: mrs.data.IPartogramService,
            private options: any, private columns: any,
            private rootScope: ng.IRootScopeService,
            private dateUtils: utils.IDateUtils) { }

        cb = (data: any, callback: any, settings: any) => {
            let sortOrder = [this.dtColumns[data.order[0].column].mData + "," + data.order[0].dir];
            this.currentPage = +(data.start / data.length);
            this.partogramService.query(data.search.value, {

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
                this.columns.newColumn("date").withTitle("Date").notSortable().renderWith(this.dateFormating),
                this.columns.newColumn("lastname").withTitle("Lastname").notSortable(),
                this.columns.newColumn("firstname").withTitle("Firstname").notSortable(),
                this.columns.newColumn("sex").withTitle("Sex").notSortable(),
                this.columns.newColumn("birthdate").withTitle("Birthdate").notSortable(),
                this.columns.newColumn(null).withTitle("Action").notSortable()
                    .renderWith(this.actionsHtml)
            ];
        }

        selectItem = (nRow: any, aData: any, iDisplayIndex: any, iDisplayIndexFull: any) => {
            let self = this;
            $("td", nRow).unbind("click");
            $("td", nRow).bind("click", function () {
                self.personSelected(aData);
            });
            return nRow;
        }
        dateFormating = (data: any, type: any, full: any, meta: any) => {
            return `<div>` + this.dateUtils.splitDate(data)[0] + `</div>`;
        }
        actionsHtml = (data: any, type: any, full: any, meta: any) => {

            return `<div class="btn-group flex-btn-group-container">
                            <button type="button" ng-click="vm.personSelected( person )" class="btn btn-primary btn-block btn-lg">
                                <span class="glyphicon glyphicon-eye-open"></span>
                                <span class="hidden-xs hidden-sm"></span>
                            </button>
                        </div>`;
        }

        personSelected = (row: any) => {
            this.selected({ personId: row.id });
            this.rootScope.$apply();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/search/search.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&"
            };

        }
    }

    app.component("mrsPartogramSearch", new Component());

}
