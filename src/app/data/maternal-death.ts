namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMaternalDeath extends IAggregateRoot<string> {
        date: Date;
        time: Date;
        deliveryId: string;
        maternalDeathFactorId: string;
        diagnosisId: string;


    }

    export interface IMaternalDeathService extends data.IAggregateRootService<IMaternalDeath, string> {
        getByDelivery: (deliveryId: string) => ng.IPromise<IMaternalDeath>;
    }

    interface IMaternalDeathResource extends IResourceService<IMaternalDeath> {
        getByDelivery: ng.resource.IResourceMethod<IMaternalDeath>;
    }

    class MaternalDeathService extends EntityService<IMaternalDeath, string, IMaternalDeathResource> implements IMaternalDeathService {

        static $inject = ["MaternalDeathResource"];
        constructor(private resource: IMaternalDeathResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IMaternalDeath>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByDelivery = (deliveryId: string): ng.IPromise<IMaternalDeath> => {
            return this.getResource().getByDelivery({ deliveryId: deliveryId }).$promise;
        }

    }

    app.factory("MaternalDeathResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IMaternalDeathResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/maternal-deaths/:id");

            return <IMaternalDeathResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                            data.time = DateUtils.convertDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        data.time = DateUtils.convertDateTimeFromServer(copy.time);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                            data.time = DateUtils.convertDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        data.time = DateUtils.convertDateTimeFromServer(copy.time);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                            data.time = DateUtils.convertDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }, "getByDelivery": {
                    url: mrs.config.Settings.serverResource("api/maternal-deaths/delivery/:deliveryId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                            data.time = DateUtils.convertDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("MaternalDeathService", MaternalDeathService);

}