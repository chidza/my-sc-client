namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITb extends IAggregateRoot<string> {
        categoryId: string;
        date: Date;
        outcome: string;
        personId: string;
        type: string;

    }

    export interface ITbService extends data.IAggregateRootService<ITb, string> {
        current: (personId: string) => ng.IPromise<ITb>;
        getByPerson: (personId: string) => ng.IPromise<Array<ITb>>;
    }

    interface ITbResource extends IResourceService<ITb> {
        current: ng.resource.IResourceMethod<ITb>;
        getByPerson: ng.resource.IResourceArrayMethod<ITb>;
    }

    class TbService extends EntityService<ITb, string, ITbResource> implements ITbService {

        static $inject = ["TbResource"];
        constructor(private resource: ITbResource) {
            super(resource);
        }
        current = (personId: string): ng.IPromise<ITb> => {
            return this.getResource().current({ personId: personId }).$promise;
        }

        getByPerson = (personId: string): ng.IPromise<Array<ITb>> => {
            return this.getResource().getByPerson({ personId: personId }).$promise;
        }
    }

    app.factory("TbResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): ITbResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/tbs/:id");

            return <ITbResource>$resource(resourceUrl, {}, {
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
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "current": {
                    url: mrs.config.Settings.serverResource("api/tbs/people/:personId/current"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getByPerson": {
                    url: mrs.config.Settings.serverResource("api/tbs/people/:personId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("TbService", TbService);

}