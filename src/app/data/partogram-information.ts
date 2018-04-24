namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPartogramInformation extends IAggregateRoot<string> {
        date: string;
        deliveryId: string;
        userId: string;
    }

    export interface IPartogramMissingInfoView {
        time: string;
        observations: Array<String>;
    }

    export interface IPartogramDangerSignView {
        time: string;
        observations: Array<String>;
    }
    export interface IPartogramDueObservationView {
        observation: string;
    }

    export interface IPartogramInformationService extends data.IAggregateRootService<IPartogramInformation, string> {
        getPartogramInformationByDeliveryId: (deliveryId: string) => ng.IPromise<Array<IPartogramInformation>>;
        getMissingInformation: (deliveryId: string) => ng.IPromise<Array<IPartogramMissingInfoView>>;
        getDangerSigns: (deliveryId: string) => ng.IPromise<Array<IPartogramDangerSignView>>;
        getDueObservations: (deliveryId: string) => ng.IPromise<Array<IPartogramDueObservationView>>;
        getFirst: (deliveryId: string) => ng.IPromise<IPartogramInformation>;
        getLast: (deliveryId: string) => ng.IPromise<IPartogramInformation>;
        getByDeliveryIdAndDate: (deliveryId: string, date: Date) => ng.IPromise<IPartogramInformation>;
    }

    interface IPartogramInformationResource extends IResourceService<IPartogramInformation> {
        getPartogramInformationByDeliveryId: ng.resource.IResourceMethod<Array<IPartogramInformation>>;
        getMissingInformation: ng.resource.IResourceMethod<Array<IPartogramMissingInfoView>>;
        getDangerSigns: ng.resource.IResourceMethod<Array<IPartogramDangerSignView>>;
        getDueObservations: ng.resource.IResourceMethod<Array<IPartogramDueObservationView>>;
        getFirst: ng.resource.IResourceMethod<IPartogramInformation>;
        getLast: ng.resource.IResourceMethod<IPartogramInformation>;
        getByDeliveryIdAndDate: ng.resource.IResourceMethod<IPartogramInformation>;
    }

    class PartogramInformationService extends EntityService<IPartogramInformation, string, IPartogramInformationResource> implements IPartogramInformationService {

        static $inject = ["PartogramInformationResource", "DateUtils"];
        constructor(private resource: IPartogramInformationResource,
            private dateUtils: utils.IDateUtils) {
            super(resource);
        }

        getPartogramInformationByDeliveryId = (deliveryId: string): ng.IPromise<Array<IPartogramInformation>> => {
            return this.getResource().getPartogramInformationByDeliveryId({ deliveryId: deliveryId }).$promise;
        }

        getMissingInformation = (deliveryId: string): ng.IPromise<Array<IPartogramMissingInfoView>> => {
            return this.getResource().getMissingInformation({ deliveryId: deliveryId }).$promise;
        }

        getDangerSigns = (deliveryId: string): ng.IPromise<Array<IPartogramDangerSignView>> => {
            return this.getResource().getDangerSigns({ deliveryId: deliveryId }).$promise;
        }

        getDueObservations = (deliveryId: string): ng.IPromise<Array<IPartogramDueObservationView>> => {
            return this.getResource().getDueObservations({ deliveryId: deliveryId }).$promise;
        }

        getFirst = (deliveryId: string): ng.IPromise<IPartogramInformation> => {
            return this.getResource().getFirst({ deliveryId: deliveryId }).$promise;
        }

        getLast = (deliveryId: string): ng.IPromise<IPartogramInformation> => {
            return this.getResource().getLast({ deliveryId: deliveryId }).$promise;
        }

        getByDeliveryIdAndDate = (deliveryId: string, date: Date): ng.IPromise<IPartogramInformation> => {
            return this.getResource().getByDeliveryIdAndDate({ deliveryId: deliveryId, date: this.dateUtils.convertLocalDateTimeToServer(date) }).$promise;
        }

    }

    app.factory("PartogramInformationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IPartogramInformationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/delivery-partograms/:id");

            return <IPartogramInformationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getDueObservations": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/due-observations"),
                },
                "getDangerSigns": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/danger-signs"),
                },
                "getMissingInformation": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/missing-information"),
                },
                "getFirst": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/delivery-partograms/first"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getLast": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/delivery-partograms/last"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getByDeliveryIdAndDate": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/delivery-partograms"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(data.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(data.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getPartogramInformationByDeliveryId": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/delivery-partograms"),
                    method: "GET",
                    isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("PartogramInformationService", PartogramInformationService);

}