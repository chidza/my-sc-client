namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncListDialog extends ng.IController {
        editAnc: () => void;
    }

    class Controller implements IAncListDialog {

        ancId: string;
        anc = {} as data.IAnc;
        feedingOptions: Array<data.IFeedingOption> = [];
        datePickerOpenStatus = {};
        showHideButton: boolean;
        hivStatus: data.IHivStatus;
        date: Date;

        public editAnc: () => void;

        static $inject = ["AncService", "dialogs", "PersonService"];
        constructor(private ancService: data.IAncService,
            private dialog: ng.dialogservice.IDialogService,
            private personService: data.IPersonService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.ancId) {
                this.ancService.get(this.ancId).then((response) => {
                    this.anc = response;
                    let n = 1;
                    let ancDayMinusOne = moment(this.anc.date).subtract(n, "day"); // HIV prior to booking should get status before registration
                    this.personService.hivStatus(this.anc.personId, ancDayMinusOne.toDate()).then((response) => {
                        this.hivStatus = response;
                    });
                });
            }
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/anc/anc-list/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                ancId: "<",
                editAnc: "&"
            };

        }
    }

    app.component("mrsAncList", new Component());

}