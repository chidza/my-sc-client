namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IInfantEditPerson extends ng.IController {
        closed: () => void;
        saved: (id: Object) => void;

    }

    class Controller implements IInfantEditPerson {

        deliveryId: string;
        infant: data.IInfant;
        personId: string;
        infants: Array<data.IInfant> = [];
        person: data.IPerson;
        datePickerOpenStatus = {};

        public saved: (personId: Object) => void;

        public closed: () => void;

        static $inject = ["InfantService", "PersonService", "dialogs"];
        constructor(private infantService: data.IInfantService,
            private personService: data.IPersonService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = () => {
            if (this.deliveryId) {
                console.log("ffffz");
                this.infantService.getByDeliveryId(this.deliveryId).then((response) => {
                    this.infants = response;
                    console.log(response);
                    console.log("ffff");
                    this.infants.forEach((infant) => {
                        this.personService.get(infant.personId).then((response) => {
                            this.person = response;
                            console.log(response);
                        });
                    });

                });
            }



        }
        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            if (this.person.id !== "") {
                console.log("update");
                this.onSave(this.personService.update(this.person));
            }
            else {
                this.onSave(this.personService.save(this.person));
            }
        }

        close = () => {
            console.log("closing ...");
            this.closed();
        }

        onSave = (promise: ng.IPromise<data.IPerson>) => {
            promise.then((response) => {
                this.saved({ personId: response.id });
            }, () => {

            });
        }



        remove = (item: data.IInfant) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.infantService.remove(item.id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/infant/edit-person.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "saved": "&",
                "closed": "&",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsInfantEditPerson", new Component());

}
