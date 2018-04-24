namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IQuarterHourly extends IAggregateRoot<string> {
        personId?: any;
        deliveryId: string;
    }

    export interface IQuarterHourlyList extends IEntity {
        date: Date;
        personVitalId: string;
        unit: string;
        value: string;
        vital: string;
    }

    export interface IQuarterHourlyForDelivery extends IEntity {
        id: string;
        personId?: any;
        deliveryId: string;
    }

    export interface ISaveQuarterHourlyForDelivery extends IEntity {
        quarterHourlyId: string;
        deliveryId: string;
    }


    export interface IQuarterHourlyService extends data.IAggregateRootService<IQuarterHourly, string> {
        // saveQuarterHourlyVitals(quarterHourlyId: string, entity: IQuarterHourlyList): ng.IPromise<IQuarterHourlyList>;
        getQuarterHourly: (quarterHourlyId: string) => ng.IPromise<Array<IQuarterHourly>>;
        getQuarterHourlyVitals: (quarterHourlyId: string) => ng.IPromise<Array<IQuarterHourlyList>>;
        getQuarterHourlyForDelivery: (deliveryId: string) => ng.IPromise<Array<IQuarterHourlyForDelivery>>;
        saveQuarterHourlyVitals(id: string, personVitalId: string): ng.IPromise<ISaveQuarterHourlyForDelivery>;
        saveQuarterHourly(deliveryId: string): ng.IPromise<IQuarterHourlyForDelivery>;
    }



    interface IQuarterHourlyResource extends IResourceService<IQuarterHourly> {
        getQuarterHourly: ng.resource.IResourceMethod<Array<IQuarterHourly>>;
        getQuarterHourlyVitals: ng.resource.IResourceMethod<Array<IQuarterHourlyList>>;
        getQuarterHourlyForDelivery: ng.resource.IResourceMethod<Array<IQuarterHourlyForDelivery>>;
        saveQuarterHourlyVitals: ng.resource.IResourceMethod<ISaveQuarterHourlyForDelivery>;
        saveQuarterHourly: ng.resource.IResourceMethod<IQuarterHourlyForDelivery>;



    }

    class QuarterHourlyService extends EntityService<IQuarterHourly, string, IQuarterHourlyResource> implements IQuarterHourlyService {

        static $inject = ["QuarterHourlyResource", "$q", "$http"];
        constructor(private resource: IQuarterHourlyResource,
            private q: ng.IQService, private http: ng.IHttpService) {
            super(resource);
        }

        /* saveQuarterHourlyVitals = (quarterlyHourlyId: string, entity: IQuarterHourlyList): ng.IPromise<IQuarterHourlyList> => {
             //return this.getResource().save({ id: quarterlyHourlyId }, entity).$promise;
         } */

        getQuarterHourly = (quarterlyHourlyId: string): ng.IPromise<Array<IQuarterHourly>> => {
            return this.getResource().getQuarterHourly({ id: quarterlyHourlyId }).$promise;
        }

        getQuarterHourlyVitals = (quarterlyHourlyId: string): ng.IPromise<Array<IQuarterHourlyList>> => {
            return this.getResource().getQuarterHourlyVitals({ id: quarterlyHourlyId }).$promise;
        }

        getQuarterHourlyForDelivery = (deliveryId: string): ng.IPromise<Array<IQuarterHourlyForDelivery>> => {
            return this.getResource().getQuarterHourlyForDelivery({ deliveryId: deliveryId }).$promise;
        }

        saveQuarterHourlyVitals = (id: string, personVitalId: string): ng.IPromise<ISaveQuarterHourlyForDelivery> => {
            //return this.getResource().saveQuarterHourlyVitals({ id: id, personVitalId: personVitalId }).$promise;


             let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/quarter-hourly/") + id + "/" + personVitalId + "/add-vital";

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }

        saveQuarterHourly = (deliveryId: string): ng.IPromise<IQuarterHourlyForDelivery> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/quarter-hourly/") + deliveryId;

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
            // return this.getResource().saveQuarterHourly({ deliveryId: deliveryId }).$promise;
        }





    }

    app.factory("QuarterHourlyResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IQuarterHourlyResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/quarter-hourly/:id");

            return <IQuarterHourlyResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },

                "saveQuarterHourlyVitals": {
                    url: mrs.config.Settings.serverResource("api/quarter-hourly/:id/:personVitalId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },

                "saveQuarterHourly": {
                    url: mrs.config.Settings.serverResource("api/quarter-hourly/:deliveryId"),
                    method: "POST",
                    /*  transformRequest: function (data) {
                         let copy = angular.copy(data);
                         copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                         return angular.toJson(copy);
                     } */
                },


                "getQuarterHourlyVitals": {
                    url: mrs.config.Settings.serverResource("api/quarter-hourly/:id/vitals"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                },

                "getQuarterHourly": {
                    url: mrs.config.Settings.serverResource("api/quarter-hourly/:id"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                },

                "getQuarterHourlyForDelivery": {
                    url: mrs.config.Settings.serverResource("api/quarter-hourly/deliveries/:deliveryId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                },
                "update": { method: "PUT" }
            });

        }]);

    app.service("QuarterHourlyService", QuarterHourlyService);

}