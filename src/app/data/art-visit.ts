namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtVisit extends IAggregateRoot<string> {
        artId: string;
        artVisitStatusId: string;
        artVisitTypeId: string;
        date: string;
        encounterId: string;
        userId: string;
    }

    export interface IArtVisitService extends data.IAggregateRootService<IArtVisit, string> {
        artSession: (opdId: string, queueId: string, artId: string) => ng.IPromise<IArtVisit>;
    }

    interface IArtVisitResource extends IResourceService<IArtVisit> {
        artSession: ng.resource.IResourceMethod<IArtVisit>;
    }

    class ArtVisitService extends EntityService<IArtVisit, string, IArtVisitResource> implements IArtVisitService {

        static $inject = ["ArtVisitResource"];
        constructor(private resource: IArtVisitResource) {
            super(resource);
        }

        artSession = (opdId: string, queueId: string, artId: string): ng.IPromise<IArtVisit> => {
            return this.getResource().artSession({ opdId: opdId, queueId: queueId, artId: artId }).$promise;
        }

    }

    app.factory("ArtVisitResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtVisitResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-visits/:id");

            return <IArtVisitResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "artSession": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounters/:queueId/art/:artId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.birthdate = dateUtils.convertLocalDateFromServer(data.birthdate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ArtVisitService", ArtVisitService);

}