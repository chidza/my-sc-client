namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncVisitList extends ng.IController {
        closed: () => void;
        saved: (visitId: Object) => void;
    }

    class Controller implements IAncVisitList {
        public closed: () => void;
        public saved: (visitId: Object) => void;
        datePickerOpenStatus = {};
        ancId: string;
        queueId: string;
        visit = {} as data.IAncVisitHistoryInit;

        static $inject = ["AncVisitService", "dialogs"];
        constructor(
            private ancVisitService: data.IAncVisitService,
            private dialog: ng.dialogservice.IDialogService) { }


        $onInit = () => {
            this.visit.ancId = this.ancId;
            this.visit.queueId = this.queueId;
        }

        openCalendar = (date: string) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }

        close = () => {
            this.closed();
        }

        save = () => {
            this.ancVisitService.createHistoricVisit(this.visit).then((response) => {
                this.saved({ visitId: response.id });
            });

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc-visit-history/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "ancId": "<",
                "queueId": "<",
                "closed": "&",
                "saved": "&"
            };

        }
    }

    app.component("mrsAncVisitCreateDialog", new Component());

}
