namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IOpd extends IAggregateRoot<string> {
        closed: Boolean;
        date: Date;
        repeatVisit: Boolean;
        facilityId: string;
        personId: string;
    }

    export interface IOpdService extends data.IAggregateRootService<IOpd, string> {
        encounters(id: string): ng.IPromise<Array<IEncounter>>;
        current(personId: string): ng.IPromise<IOpd>;
        opdSession(opdId: string, queueId: string): ng.IPromise<IEncounter>;
        discharge(opdId: string): ng.IPromise<IOpd>;
    }

    interface IOpdResource extends IResourceService<IOpd> {
        encounters: ng.resource.IResourceArrayMethod<IEncounter>;
        current: ng.resource.IResourceMethod<IOpd>;
        discharge: ng.resource.IResourceMethod<IOpd>;
        opdSession: ng.resource.IResourceMethod<IEncounter>;
    }

    class OpdService extends EntityService<IOpd, string, IOpdResource> implements IOpdService {

        static $inject = ["OpdResource"];
        constructor(private resource: IOpdResource) {
            super(resource);
        }

        encounters = (id: string): ng.IPromise<Array<IEncounter>> => {
            return this.getResource().encounters({ id: id }).$promise;
        }

        current = (personId: string): ng.IPromise<IOpd> => {
            return this.getResource().current({ personId: personId }).$promise;
        }

        discharge = (opdId: string): ng.IPromise<IOpd> => {
            return this.getResource().discharge({ opdId: opdId }, {}).$promise;
        }

        opdSession = (opdId: string, queueId: string): ng.IPromise<IEncounter> => {
            return this.getResource().opdSession({ id: opdId, queueId: queueId }).$promise;
        }

    }

    app.factory("OpdResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IOpdResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/opds/:id");

            return <IOpdResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "encounters": {
                    url: mrs.config.Settings.serverResource("api/opds/:id/encounters"),
                    method: "GET",
                    isArray: true
                },
                "opdSession": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/opds/:id/encounters/:queueId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
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
                "current": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/opds/people/:personId/current"),
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
                "discharge": {
                    method: "POST",
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/discharge"),
                    transformResponse: function (data) {
                        if (data) {
                            return angular.toJson(data);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("OpdService", OpdService);

}