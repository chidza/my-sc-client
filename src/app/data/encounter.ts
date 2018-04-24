namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounter extends IAggregateRoot<string> {
        date: Date;
        departmentId: string;
        state: string;
    }

    export interface IEncounterService extends data.IAggregateRootService<IEncounter, string> {
        query(text?: string): ng.IPromise<Array<IEncounter>>;
        signOff(id: string): ng.IPromise<IEncounter>;
    }

    interface IEncounterResource extends IResourceService<IEncounter> {
        signOff: ng.resource.IResourceMethod<IEncounter>;
    }

    class EncounterService extends EntityService<IEncounter, string, IEncounterResource> implements IEncounterService {

        static $inject = ["EncounterResource"];
        constructor(private resource: IEncounterResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IEncounter>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        signOff = (id: string): ng.IPromise<IEncounter> => {
            return this.getResource().signOff({ id: id }, {}).$promise;
        }
    }

    app.factory("EncounterResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IEncounterResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounters/:id");

            return <IEncounterResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
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
                },
                "signOff": {
                    method: "POST",
                    url: mrs.config.Settings.serverResource("encounters/:id/signoff"),
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }

            });

        }]);

    app.service("EncounterService", EncounterService);

}