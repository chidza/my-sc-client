namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IContractionList extends ng.IController {
        editContraction: (contractionId: Object) => void;
        addContraction: () => void;
    }

    class Controller implements IContractionList {
        deliveryId: string;
        contraction: Array<data.IContraction> = [];

        public editContraction: (contractionId: Object) => void;
        public addContraction: () => void;

        static $inject = ["ContractionService", "dialogs"];
        constructor(private contractionService: data.IContractionService,
            private dialog: ng.dialogservice.IDialogService) {

        }


        $onInit = () => {
            if (this.deliveryId) {
                this.contractionService.getContractions(this.deliveryId).then((response) => {
                    console.log("this has been put", response);
                    this.contraction = response;
                    console.log(this.contraction);
                });
            }
        }



        edit = (item: data.IContraction) => {
            this.editContraction({ contractionId: item.id });
        }

        remove = (item: data.IContraction) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.contractionService.remove(item.id).then((response) => {
                    this.contraction.splice(this.contraction.indexOf(item), 1);
                });
            }, (error) => {

            });
        }

        add = () => {
            console.log("add");
            this.addContraction();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/contractions/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editContraction: "&",
                addContraction: "&",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsContractionList", new Component());

}
