namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IInfantList extends ng.IController {
        addBirthOutcome: () => void;
        editBirthOutcome: (infantId: Object) => void;
        editBirthPerson: (personId: Object) => void;
    }

    class Controller implements IInfantList {

        personId: string;
        deliveryId: string;
        infantId: string;
        start: string;
        end: string;
        notify: number;
        cervices: Array<data.ICervixView> = [];
        foetal: Array<data.IInfantPersonList> = [];
        infants: Array<data.IInfantPersonList> = [];

        public addBirthOutcome: () => void;
        public editBirthOutcome: (infantId: Object) => void;
        public editBirthPerson: (personId: Object) => void;

        static $inject = ["$state", "DeliveryService", "CervixService", "InfantService", "FoetalDeathService", "dialogs"];


        constructor(
            private state: ng.ui.IStateService,
            private deliveryService: data.IDeliveryService,
            private cervixService: data.ICervixService,
            private infantService: data.IInfantService,
            private foetalDeathService: data.IFoetalDeathService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            this.foetal = [];
            this.infants = [];
            if (this.deliveryId) {
                this.infantService.getByPersonId(this.deliveryId).then((response) => {
                    if (response) {
                        response.forEach((infant) => {
                            if (infant.outcome === "ALIVE") {
                                this.infants.push(infant);
                            }
                            if (infant.outcome === "DEAD") {
                                this.foetal.push(infant);
                            }
                        });
                    }
                });
            }

            this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                this.notify = 0;
                this.cervixService.getCervixesGraph(this.deliveryId, response.startTime, response.endTime).then((cervices) => {
                    this.cervices = cervices;
                    console.log(this.cervices);
                });
            });
        }

        add = () => {


            // return true or false based on response
            console.log("notify");
            console.log(this.getStatusCervix());


            if (this.getStatusCervix() < 10) {
                this.dialog.error("Warning", "Warning, Full Dilatation has not been captured!!");

            }
            // check if cervix 10 has been put first: 
            // if yes resume if not return a pop-up 
            // upon yes from user response should then add 10cm to database 
            // close pop-up
            // proceed

            this.addBirthOutcome();
        }

        getStatusCervix = (): number => {
            this.cervices.forEach((survey) => {
                if (survey.dilatation === "10.0") {
                    console.log("survey.dilatation logging");
                    this.notify = 10;
                    console.log("value", this.notify);
                    // dont show 
                }
                else {
                    // show
                }
            });
            return this.notify;
        }

        edit = (id: string) => {
            this.editBirthOutcome({ infantId: id });
        }

        editPerson = (personId: string) => {
            this.editBirthPerson({ personId: personId });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/infant/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "addBirthOutcome": "&",
                "editBirthOutcome": "&",
                "editBirthPerson": "&",
                "personId": "<",
                "deliveryId": "<",
                "start": "@",
                "end": "@",
            };

        }
    }

    app.component("mrsInfantList", new Component());

}
