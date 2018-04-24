namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonArtStatus extends IAggregateRoot<string> {
        artReasonId: string;
        artStatusId: string;
        arvCombinationRegimenId: string;
        date: Date;
        artId: string;
    }

    export interface IPersonArtStatusService extends data.IAggregateRootService<IPersonArtStatus, string> {
        getCurrent: (artId: string) => ng.IPromise<IPersonArtStatus>;
        getFirst: (artId: string) => ng.IPromise<IPersonArtStatus>;
    }

    interface IPersonArtStatusResource extends IResourceService<IPersonArtStatus> {
        getCurrent: ng.resource.IResourceMethod<IPersonArtStatus>;
        getFirst: ng.resource.IResourceMethod<IPersonArtStatus>;
    }

    class PersonArtStatusService extends EntityService<IPersonArtStatus, string, IPersonArtStatusResource> implements IPersonArtStatusService {

        static $inject = ["PersonArtStatusResource"];
        constructor(private resource: IPersonArtStatusResource) {
            super(resource);
        }

        getCurrent = (artId: string): ng.IPromise<IPersonArtStatus> => {
            return this.getResource().getCurrent({ artId: artId }).$promise;
        }
        getFirst = (artId: string): ng.IPromise<IPersonArtStatus> => {
            return this.getResource().getFirst({ artId: artId }).$promise;
        }

    }

    app.factory("PersonArtStatusResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IPersonArtStatusResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-art-statuses/:id");

            return <IPersonArtStatusResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getCurrent": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-statuses/getCurrent/:artId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }, "getFirst": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-statuses/getFirst/:artId"),
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

    app.service("PersonArtStatusService", PersonArtStatusService);

}