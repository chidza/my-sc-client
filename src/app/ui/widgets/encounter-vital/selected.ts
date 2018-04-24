namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterVitalListController extends ng.IController {
        addVital: () => void;
        refreshed: () => void;
        editVital: (encounterVitalId: Object) => void;
        closed: () => void;
        selected: (personVitalId: Object) => void;
    }

    class Controller implements IEncounterVitalListController {
        refresh: number;
        encounterId: string;
        vitalId: string;
        section: string;
        encounterVitals: Array<data.IEncounterVitalList> = [];
        workspaceId: string;
        personId: string;
        currentUser: string;

        public addVital: () => void;
        public editVital: (encounterVitalId: Object) => void;
        public selected: (encounterVitalId: Object) => void;
        public refreshed: () => void;
        public closed: () => void;

        static $inject = ["EncounterVitalService", "dialogs", "PersonVitalService"
            , "ConsultationService", "Principal"];
        constructor(private encounterVitalService: data.IEncounterVitalService,
            private dialog: ng.dialogservice.IDialogService,
            private personVitalService: data.IPersonVitalService,
            private consultationService: data.IConsultationService,
            private principal: security.IPrincipal) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            console.log("workspace>", this.workspaceId);
            console.log("person>", this.personId);
            console.log("vital>", this.vitalId);
            if (this.workspaceId) {
                this.principal.identity().then((response) => {
                    this.currentUser = response.login;
                });

                this.consultationService.getVitalsByVitalType(this.workspaceId, this.personId, this.vitalId).then((response) => {
                    this.encounterVitals = response;
                });
            }

        }

        add = () => {
            this.addVital();
        }

        edit = (model: data.IEncounterVitalList) => {
            this.editVital({ id: model.personVitalId });
        }

        close = () => {
            this.closed();
        }

        use = (model: data.IEncounterVitalList) => {
            this.selected({ id: model.encounterVitalId });
        }

        delete = (model: data.IEncounterVitalList) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.encounterVitalService.remove(model.encounterVitalId).then((response) => {
                    this.encounterVitals.splice(this.encounterVitals.indexOf(model), 1);
                });
            }, (error) => {
                this.dialog.error("Error", "Unable to delete complaint at this time. Please try again");
            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/encounter-vital/selected.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                addVital: "&",
                editVital: "&",
                refreshed: "&",
                refresh: "<",
                workspaceId: "<",
                personId: "<",
                vitalId: "<",
                closed: "&",
                encounterId: "<"
            };

        }
    }

    app.component("mrsEncounterVitalSelectedList", new Component());

}