namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEditPersonButton extends ng.IController {

    }

    class Controller implements IEditPersonButton {

        personId: string;

        static $inject = ["$uibModal"];
        constructor(private modal: ng.ui.bootstrap.IModalService) {

        }

        edit = (personId: string) => {

            let template: string = `
        <div class="modal-header">           
            <h4 class="modal-title">Create or edit a Person</h4>
        </div>
        <div class="modal-body">
          <br/>
          <mrs-person-dialog person-id="$resolve.personId" closed="vm.onClose()"></mrs-person-dialog>
        </div>
        <div class="modal-footer">
        </div>
        `;

            let modalInstance = this.modal.open({
                controller: function () {
                    this.onClose = function () {
                        modalInstance.close();
                    };
                },
                template: template,
                controllerAs: "vm",
                size: "lg",
                backdrop: "static",
                resolve: {
                    personId: personId
                }
            });

            modalInstance.result.then(
                (response) => {
                    console.log("1", response);
                },
                (response) => {
                    console.log("2", response);
                }
            );

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        personId: string;

        constructor(
            public template = `<button type="button" class="btn btn-default" ng-click="vm.edit(vm.personId)">Edit Person</button>`,
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<"
            };

        }
    }

    app.component("mrsEditPersonButton", new Component());

}
