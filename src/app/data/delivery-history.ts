namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDeliveryHistory extends IAggregateRoot<string> {
        contraction: boolean;
        timeOfOnSet: Date;
        dateOfOnSet: Date;
        duration: string;
        membranesRuptured: boolean;
        timeOfRupture: Date;
        dateOfRupture: Date;
        showPresent: boolean;
    }

    export interface IDeliveryHistoryService extends data.IAggregateRootService<IDeliveryHistory, string> {

    }

    interface IDeliveryHistoryResource extends IResourceService<IDeliveryHistory> {

    }

    class DeliveryHistoryService extends EntityService<IDeliveryHistory, string, IDeliveryHistoryResource> implements IDeliveryHistoryService {

        static $inject = ["DeliveryHistoryResource"];
        constructor(private resource: IDeliveryHistoryResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDeliveryHistory>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("DeliveryHistoryResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IDeliveryHistoryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/delivery-histories/:id");

            return <IDeliveryHistoryResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.timeOfOnSet = DateUtils.convertDateTimeFromServer(data.timeOfOnSet);
                            data.dateOfOnSet = DateUtils.convertDateTimeFromServer(data.timeOfOnSet);
                            data.timeOfRupture = DateUtils.convertDateTimeFromServer(data.timeOfRupture);
                            data.dateOfRupture = DateUtils.convertDateTimeFromServer(data.timeOfRupture);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        if (copy.dateOfOnSet && copy.timeOfOnSet)
                            copy.timeOfOnSet = DateUtils.combineDate(moment(copy.dateOfOnSet).format("YYYY-MM-DD"), moment(copy.timeOfOnSet).format("HH:mm:ss"));
                        if (copy.dateOfRupture && copy.timeOfRupture)
                            copy.timeOfRupture = DateUtils.combineDate(moment(copy.dateOfRupture).format("YYYY-MM-DD"), moment(copy.timeOfRupture).format("HH:mm:ss"));
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.timeOfOnSet = DateUtils.convertDateTimeFromServer(data.timeOfOnSet);
                            data.dateOfOnSet = DateUtils.convertDateTimeFromServer(data.timeOfOnSet);
                            data.timeOfRupture = DateUtils.convertDateTimeFromServer(data.timeOfRupture);
                            data.dateOfRupture = DateUtils.convertDateTimeFromServer(data.timeOfRupture);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                     transformRequest: function (data) {
                        let copy = angular.copy(data);
                        if (copy.dateOfOnSet && copy.timeOfOnSet)
                            copy.timeOfOnSet = DateUtils.combineDate(moment(copy.dateOfOnSet).format("YYYY-MM-DD"), moment(copy.timeOfOnSet).format("HH:mm:ss"));
                        if (copy.dateOfRupture && copy.timeOfRupture)
                            copy.timeOfRupture = DateUtils.combineDate(moment(copy.dateOfRupture).format("YYYY-MM-DD"), moment(copy.timeOfRupture).format("HH:mm:ss"));
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.timeOfOnSet = DateUtils.convertDateTimeFromServer(data.timeOfOnSet);
                            data.dateOfOnSet = DateUtils.convertDateTimeFromServer(data.timeOfOnSet);
                            data.timeOfRupture = DateUtils.convertDateTimeFromServer(data.timeOfRupture);
                            data.dateOfRupture = DateUtils.convertDateTimeFromServer(data.timeOfRupture);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("DeliveryHistoryService", DeliveryHistoryService);

}