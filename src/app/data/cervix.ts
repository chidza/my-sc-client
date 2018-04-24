namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ICervix extends IAggregateRoot<string> {
        time: Date;
        deliveryId: string;
        dilatation: number;
        effacement: number;
        descentId: string;


    }

    export interface ICervixes extends ng.resource.IResource<ICervixes> {
        alertPoints: Array<number>;
        transferPoints: Array<number>;
        actionPoints: Array<number>;
        descentOfHead: Array<number>;
        dilatation: Array<number>;
    }

    export interface ICervixView extends ng.resource.IResource<ICervixView> {
        time: Date;
        dilatation: string;
        descent: string;

    }

    export interface TransferPoint {
        value: number;
        name: string;
        time: any;
    }

    export interface AlertPoint {
        value: number;
        name: string;
        time: any;
    }

    export interface ActionPoint {
        value: number;
        name: string;
        time: any;
    }

    export interface CloseFetalHeartRateAndPulse {
        value: number;
        name: string;
        time: any;
    }
    export interface CloseTemp {
        value: number;
        name: string;
        time: any;
    }
    export interface CloseContraction {
        value: number;
        name: string;
        time: any;
    }
    export interface ClosePoint {
        value: number;
        name: string;
        time: any;
    }

    export interface ICervixViewLines extends ng.resource.IResource<ICervixViewLines> {
        transferPoints: TransferPoint[];
        alertPoints: AlertPoint[];
        actionPoints: ActionPoint[];
        CloseFetalHeartRateAndPulse: CloseFetalHeartRateAndPulse[];
        CloseTemp: CloseTemp[];
        CloseContraction: CloseContraction[];
        closePoints: ClosePoint[];
    }

    export interface ICervixService extends data.IAggregateRootService<ICervix, string> {
        fetch: (deliveryId: string) => ng.IPromise<Array<ICervix>>;
        getCervixesByDeliveryInActivePhase(deliveryId: string, from: string, to: string): ng.IPromise<ICervixes>;
        getCervixesByDeliveryDateTime(deliveryId: string, date: string): ng.IPromise<ICervix>;
        checkMissingRecordings: (deliveryId: string, start: string, end: string) => ng.IPromise<Array<ICervixView>>;

        getCervixesGraph(deliveryId: string, from: string, to: string): ng.IPromise<Array<ICervixView>>;
        getCervixesGraphLines(deliveryId: string): ng.IPromise<ICervixViewLines>;

    }

    interface ICervixResource extends IResourceService<ICervix> {
        fetch: ng.resource.IResourceMethod<Array<ICervix>>;
        getCervixesByDeliveryInActivePhase: ng.resource.IResourceMethod<ICervixes>;
        getCervixesByDeliveryDateTime: ng.resource.IResourceMethod<ICervix>;
        checkMissingRecordings: ng.resource.IResourceMethod<Array<ICervixView>>;

        getCervixesGraph: ng.resource.IResourceMethod<Array<ICervixView>>;
        getCervixesGraphLines: ng.resource.IResourceMethod<ICervixViewLines>;



    }

    class CervixService extends EntityService<ICervix, string, ICervixResource> implements ICervixService {

        static $inject = ["CervixResource"];
        constructor(private resource: ICervixResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ICervix>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        fetch = (deliveryId: string): ng.IPromise<Array<ICervix>> => {
            return this.getResource().fetch({ deliveryId: deliveryId }).$promise;
        }

        getCervixesByDeliveryInActivePhase = (deliveryId: string, from: string, to: string): ng.IPromise<ICervixes> => {
            return this.getResource().getCervixesByDeliveryInActivePhase({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }

        getCervixesByDeliveryDateTime = (deliveryId: string, date: string): ng.IPromise<ICervix> => {
            return this.getResource().getCervixesByDeliveryDateTime({ deliveryId: deliveryId, date: date }).$promise;
        }
        checkMissingRecordings = (deliveryId: string, start: string, end: string): ng.IPromise<Array<ICervixView>> => {
            return this.getResource().checkMissingRecordings({ deliveryId: deliveryId, start: start, end: end }).$promise;
        }

        getCervixesGraph = (deliveryId: string, from: string, to: string): ng.IPromise<Array<ICervixView>> => {
            return this.getResource().getCervixesGraph({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }
        getCervixesGraphLines = (deliveryId: string): ng.IPromise<ICervixViewLines> => {
            return this.getResource().getCervixesGraphLines({ deliveryId: deliveryId }).$promise;
        }

    }

    app.factory("CervixResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): ICervixResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/cervixes/:id");

            return <ICervixResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "fetch": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/cervixes/delivery/:deliveryId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.time = DateUtils.convertLocalDateTimeToServer(copy.time);

                        return angular.toJson(copy);
                    }, transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.time = DateUtils.convertLocalDateTimeToServer(copy.time);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }, "checkMissingRecordings": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/cervixes/check-missing-recordings"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getCervixesByDeliveryInActivePhase": {
                    url: mrs.config.Settings.serverResource("api/cervixes/:deliveryId/active-labour-cervixes"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },

                "getCervixesGraph": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/cervix-graph/active-phase-new-test"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getCervixesGraphLines": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/cervix-graph-lines/active-phase-new-test"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getCervixesByDeliveryDateTime": {
                    url: mrs.config.Settings.serverResource("api/cervixes/:deliveryId/get-by-delivery-date"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("CervixService", CervixService);

}