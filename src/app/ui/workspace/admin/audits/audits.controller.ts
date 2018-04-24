namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        audits: Array<data.IAuditLog> = [];
        fromDate: Date = null;

        page: number = 1;

        toDate: Date = null;
        // today: Date = null;
        totalItems: number = null;

        static $inject = ["$filter", "AuditsService"];
        constructor(private $filter: ng.IFilterService, private AuditsService: data.IAuditsService) {

        }

        $onInit = () => {

        }

        onChangeDate = () => {
            let dateFormat = "yyyy-MM-dd";
            let fromDate = this.$filter("date")(this.fromDate, dateFormat);
            let toDate = this.$filter("date")(this.toDate, dateFormat);

            this.AuditsService.query({ page: this.page - 1, size: 20, fromDate: fromDate, toDate: toDate }
                , (result: any, headers: any) => {
                    this.audits = result;
                    // this.links = ParseLinks.parse(headers("link"));
                    // this.totalItems = headers("X-Total-Count");
                });
        }

        // Date picker configuration
        today = (): void => {
            // Today + 1 day - needed if the current day must be included
            let today = new Date();
            this.toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        }

        previousMonth = () => {
            let fromDate = new Date();
            if (fromDate.getMonth() === 0) {
                fromDate = new Date(fromDate.getFullYear() - 1, 11, fromDate.getDate());
            } else {
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
            }

            this.fromDate = fromDate;
        }

        loadPage = (page: number) => {
            this.page = page;
            this.onChangeDate();
        }

    }

    class Component implements ng.IComponentOptions {
        templateUrl = "app/ui/workspace/admin/audits/audits.html";
        controller = Controller;
        controllerAs = "this";
    }

    app.component("mrsAudit", new Component());

}