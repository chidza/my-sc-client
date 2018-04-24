namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterNoteDialog extends ng.IController {
        closed: () => void;
        saved: (encounterNoteId: Object) => void;
    }

    class Controller implements IEncounterNoteDialog {

        encounterNoteId: string;
        encounterId: string;
        encounterNote = {} as data.IEncounterNote;
        encounterNotes = [] as Array<data.IEncounterNote>;

        public closed: () => void;
        public saved: (encounterNoteId: Object) => void;

        static $inject = ["EncounterNoteService"];
        constructor(private encounterNoteService: data.IEncounterNoteService) {

        }


        $onInit = () => {

            if (this.encounterNoteId) {
                console.log(this.encounterNoteId);

                this.encounterNoteService.get(this.encounterNoteId).then((response) => {
                    this.encounterNote = response;
                    console.log(this.encounterNote, "data");
                }, (error) => {

                    console.log("error ndine");
                    this.encounterNote = {
                        encounterId: this.encounterId,
                        date: new Date()
                    } as data.IEncounterNote;
                });
            }
        }

        save = () => {
            if (this.encounterNote.id !== "") {
                this.onSave(this.encounterNoteService.update(this.encounterNote));
            }
            else {
                this.onSave(this.encounterNoteService.save(this.encounterNote));
            }
        }

        onSave = (promise: ng.IPromise<data.IEncounterNote>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    this.saved({ encounterNoteId: response.id });
                }
            }, () => {
                // error!
            });
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/encounter-note/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterNoteId: "<",
                encounterId: "<",
                closed: "&",
                saved: "&"
            };

        }
    }

    app.component("mrsEncounterNoteDialog", new Component());

}
