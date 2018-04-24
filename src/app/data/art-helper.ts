namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtSession {
        encounterId: string;
    }

    export interface IArtModuleService {
        getArtSession(workareaId: string, personId: string): ng.IPromise<IArtVisit>;
        checkRegistration(personId: string): ng.IPromise<boolean>;
    }

    class ArtModuleService implements IArtModuleService {

        artId: string;
        art = {} as data.IArt;
        opdId: string;

        static $inject = ["$state", "dialogs", "OpdService", "ArtService", "ArtVisitService", "$q"];
        constructor(private state: ng.ui.IStateService, private dialog: ng.dialogservice.IDialogService,
            private opdService: IOpdService,
            private artService: IArtService,
            private artVisitService: IArtVisitService,
            private q: ng.IQService) {

        }

        getArtSession = (workareaId: string, personId: string): ng.IPromise<IArtVisit> => {
            let defer = this.q.defer();
            this.opdService.current(personId).then((response) => {
                this.opdId = response.id;
                this.artService.getByPersonId(personId).then((response) => {
                    this.artVisitService.artSession(this.opdId, workareaId, response.id).then((response) => {
                        defer.resolve(response);
                    });
                });
            });
            return defer.promise;
        }
        checkRegistration = (personId: string): ng.IPromise<boolean> => {
            let defer = this.q.defer();
            this.artService.getByPersonId(personId).then((response) => {
                this.art = response;
                this.artId = response.id;
                defer.resolve(true);
            }, (error) => {
                let dlg = this.dialog.confirm("ART Registration", "Patient has no ART record. Do you wish to create one and register patient?");
                dlg.result.then((btn) => {
                    this.art.date = new Date();
                    this.art.artNumber = "";
                    this.art.personId = personId;
                    this.artService.save(this.art).then((response) => {
                        this.art = response;
                        this.artId = response.id;
                        this.state.go("consultation.management.artRegistration.familyMember.list");
                    });
                }, () => {
                    defer.resolve(false);
                });
            });
            return defer.promise;
        }
    }

    app.service("ArtModuleService", ArtModuleService);

}