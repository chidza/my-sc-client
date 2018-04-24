namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramNoteList extends ng.IController {
        editEncounterNote: (encounterNoteId: Object) => void;
        addEncounterNote: () => void;
    }

    class Controller implements IPartogramNoteList {
        encounterId: string;
        encounterNoteId: string;
        babiesNoteId: string;
        encounterNotes: Array<data.IEncounterNote> = [];
        endTime: any;
        status: boolean;

        public editEncounterNote: (encounterNoteId: Object) => void;
        public addEncounterNote: () => void;

        static $inject = ["EncounterNoteService", "dialogs", "SiteSettingService"];
        constructor(private encounterNoteService: data.IEncounterNoteService,
            private dialog: ng.dialogservice.IDialogService,
            private siteSettingService: data.ISiteSettingService) {

        }


        $onInit = () => {
            if (this.encounterId) {
                this.encounterNoteService.getNotesByEncounterId(this.encounterId).then((response) => {
                    this.encounterNotes = response;
                    console.log(this.encounterNotes);
                });
            }

            this.siteSettingService.currentTime().then((response) => {
                this.endTime = moment(response.currentTime); // moment(new Date(this.currentTime.currentTime)).format("HH:mm") + "?");                                                 
            });
        }



        edit = (item: data.IEncounterNote) => {
            console.log("edit>>>>>",item.id);
            this.editEncounterNote({ encounterNoteId: item.id });
        }

        remove = (item: data.IEncounterNote) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.encounterNoteService.remove(item.id).then((response) => {
                    this.encounterNotes.splice(this.encounterNotes.indexOf(item), 1);
                });
            }, (error) => {

            });
        }

        add = () => {
            console.log("add");
            this.addEncounterNote();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/encounter-note/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editEncounterNote: "&",
                addEncounterNote: "&",
                encounterNoteId: "<",
                babiesNoteId: "<",
                encounterId: "<"
            };

        }
    }

    app.component("mrsNoteList", new Component());

}
