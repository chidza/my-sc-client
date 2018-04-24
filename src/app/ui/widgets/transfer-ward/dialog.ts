namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAdmissionTransferWardDialog extends ng.IController {
        closed: () => void;
        saved: () => void;

    }

    class Controller implements IAdmissionTransferWardDialog {

        personId: string;
        admission = {} as data.IAdmission;
        wards: Array<data.IWard> = [];
        public closed: () => void;
        public saved: () => void;

        static $inject = ["AdmissionService", "WardService", "dialogs"];
        constructor(private admissionService: data.IAdmissionService,
            private wardService: data.IWardService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onInit = () => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.admissionService.current(this.personId).then((response) => {

                    this.admissionService.get(response.admissionId).then((admission) => {
                        this.admission = admission;
                    });

                });
            }
            this.wardService.query().then((response) => {
                this.wards = response;
            });
        }

        save = () => {
            this.admissionService.remove(this.admission.id).then((r) => {
                this.admissionService.update(this.admission).then((response) => {
                    this.init();
                    this.saved();
                });
            });

        }

        close = () => {
            this.closed();
        }

        isExist = (id: string): boolean => {
            let checked = false;
            if (this.admission.id) {
                if (this.admission.wardId === id) {
                    checked = true;
                }
            }
            return checked;
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/transfer-ward/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                closed: "&",
                saved: "&"
            };

        }
    }

    app.component("mrsAdmissionTransferWardDialog", new Component());

}
