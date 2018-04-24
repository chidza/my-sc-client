namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface LedgerBalance {
        date: Date;
        balance: number;
    }

    class Controller implements ng.IController {

        personId: string;

        ledger: LedgerBalance = {
            date: new Date(),
            balance: 0.00
        };

        constructor() {

        }

    }

    class Component implements ng.IComponentOptions {
        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/widgets/account/balance-label.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "personId": "<"
            };
        }
    }

    app.component("mrsAccountBalanceLabel", new Component());

} 