namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPnc extends IAggregateRoot<string> {
        date: Date;
        personId: string;
    }

    export interface IPncService extends data.IAggregateRootService<IPnc, string> {
        current: (personId: string) => ng.IPromise<IPnc>;
        getByPerson: (personId: string) => ng.IPromise<Array<IPnc>>;
        getByPncId: (pncId: string) => ng.IPromise<IPnc>;
        getByDeliveryId: (deliveryId: string) => ng.IPromise<IPnc>;
    }

    interface IPncResource extends IResourceService<IPnc> {
        current: ng.resource.IResourceMethod<IPnc>;
        getByPerson: ng.resource.IResourceArrayMethod<IPnc>;
        getByPncId: ng.resource.IResourceMethod<IPnc>;
        getByDeliveryId: ng.resource.IResourceMethod<IPnc>;


    }

    class PncService extends EntityService<IPnc, string, IPncResource> implements IPncService {

        static $inject = ["PncResource"];
        constructor(private resource: IPncResource) {
            super(resource);
        }
        current = (personId: string): ng.IPromise<IPnc> => {
            return this.getResource().current({ personId: personId }).$promise;
        }
        getByPerson = (personId: string): ng.IPromise<Array<IPnc>> => {
            return this.getResource().getByPerson({ personId: personId }).$promise;
        }
        getByPncId = (pncId: string): ng.IPromise<IPnc> => {
            return this.getResource().getByPncId({ pncId: pncId }).$promise;
        }
        getByDeliveryId = (deliveryId: string): ng.IPromise<IPnc> => {
            return this.getResource().getByDeliveryId({ deliveryId: deliveryId }).$promise;
        }
    }

    app.factory("PncResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPncResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pncs/:id");

            return <IPncResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    },
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getByDeliveryId": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/pnc"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },


                "getByPncId": {
                    url: mrs.config.Settings.serverResource("api/pnc-properties/:id"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "current": {
                    url: mrs.config.Settings.serverResource("api/pncs/people/:personId/current"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getByPerson": {
                    url: mrs.config.Settings.serverResource("api/pncs/people/:personId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("PncService", PncService);

}