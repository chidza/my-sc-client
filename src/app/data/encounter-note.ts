namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterNote extends IAggregateRoot<string> {
        date: Date;
        encounterId: string;
        note: string;
    }

    export interface IEncounterNoteService extends data.IAggregateRootService<IEncounterNote, string> {
        fetch: (text?: string) => ng.IPromise<Array<IEncounterNote>>;
        getNotesByEncounterId: (encounterId: string) => ng.IPromise<Array<IEncounterNote>>;
    }

    interface IEncounterNoteResource extends IResourceService<IEncounterNote> {
        getNotesByEncounterId: ng.resource.IResourceArrayMethod<IEncounterNote>;
    }

    class EncounterNoteService extends EntityService<IEncounterNote, string, IEncounterNoteResource> implements IEncounterNoteService {

        static $inject = ["EncounterNoteResource"];
        constructor(private resource: IEncounterNoteResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IEncounterNote>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        fetch = (text?: string): ng.IPromise<Array<IEncounterNote>> => {
            return this.getResource().query({ text: text }).$promise;
        }

        getNotesByEncounterId = (encounterId: string): ng.IPromise<Array<IEncounterNote>> => {
            return this.getResource().getNotesByEncounterId({ encounterId: encounterId }).$promise;
        }


    }

    app.factory("EncounterNoteResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IEncounterNoteResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-notes/:id");

            return <IEncounterNoteResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getOne": {
                    url: mrs.config.Settings.serverResource("api/encounter-notes/getOne/:id"),
                    method: "GET",
                    isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getNotesByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-notes/encounter/:encounterId"),
                    method: "GET",
                    isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("EncounterNoteService", EncounterNoteService);

}