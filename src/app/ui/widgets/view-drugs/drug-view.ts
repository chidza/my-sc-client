namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramDrugList extends ng.IController {

    }

    class Controller implements IPartogramDrugList {
        medicationList: Array<data.IPartogramDrugList> = [];
        personId: string;
        encounterId: string;
        date: string;
        refreshMedication: number = 1;



        static $inject = ["PersonMedicationService", "dialogs", "DispenseService", "$uibModal"];
        constructor(private personMedicationService: data.IPersonMedicationService,
            private dialog: ng.dialogservice.IDialogService,
            private dispenseService: data.IDispenseService,
            private modal: ng.ui.bootstrap.IModalService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId && this.date) {
                this.dispenseService.getByPersonIdAndDate(this.personId, this.date).then((response) => {
                    this.medicationList = response;
                });
            }
        }

        modelTemplate = (header: string, body: string, footer: string) => {
            return `<div class="modal-header">           
                  <h4 class="modal-title">` + header + `</h4>
              </div>
              <div class="modal-body">
                <br/>` +
                body +
                ` <br></div>
              <div class="modal-footer">`
                + footer +
                `</div>`;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/view-drugs/drug-view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                encounterId: "<",
                date: "<"
            };

        }
    }

    app.component("mrsPartogramDrugView", new Component());

}
