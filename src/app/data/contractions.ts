namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IContraction extends IAggregateRoot<string> {

        date: Date;
        deliveryId: string;
        dilation: number;
        frequency?: number;
        id: string;
        strength?: string;

    }

    export interface IContractionGraph {
        weak: Array<IGraphPoints>;
        strong: Array<IGraphPoints>;
        datapoints: Array<IGraphPoints>;
    }

    export interface IGraphPoints {
        x?: string;
        y?: string;
        status: string;
    }

    export interface IContractionList extends ng.resource.IResource<IContractionList> {
        weak?: Array<IGraphPoints>;
        moderate?: Array<IGraphPoints>;
        strong?: Array<IGraphPoints>;


    }

    export interface IContractionListGraph extends ng.resource.IResource<IContractionList> {
        weak?: Array<IGraphPoints>;
        moderate?: Array<IGraphPoints>;
        strong?: Array<IGraphPoints>;
        FirstX?: Array<IGraphPoints>;
        LastX?: Array<IGraphPoints>;

    }

    export interface IContractionBlock {
        weak?: Array<IGraphPoints>;
        moderate?: Array<IGraphPoints>;
    }

    export interface IContractionView extends ng.resource.IResource<IContractionView> {
        time: string;
        status: string;
    }

    export interface IContractionValidation extends ng.resource.IResource<IContractionValidation> {
        frequency?: string;
        notification?: string;
        frequencyNote?: string;
        distribution?: string;
        distributionNote?: string;
        trend?: string;
        trendNote?: string;
    }

    export interface IContractionService extends data.IAggregateRootService<IContraction, string> {
        getContractions: (deliveryId: string) => ng.IPromise<Array<IContraction>>;
        saveMultipleContractions: (contractionsList: Array<IContraction>) => ng.IPromise<Array<IContraction>>;
        getContractionsByDeliveryInActivePhase(deliveryId: string, from: string, to: string): ng.IPromise<IContractionList>;
        getContractionsForGraph(deliveryId: string, from: string, to: string): ng.IPromise<IContractionListGraph>;
        checkContractionsByDeliveryAndDateTime(deliveryId: string, date: string): ng.IPromise<IContractionValidation>;
        getContractionsByDeliveryIdAndDate: (deliveryId: string, date: string) => ng.IPromise<Array<IContraction>>;
        getMissingContractions: (deliveryId: string, start: string, end: string, interval: number) => ng.IPromise<Array<IContractionView>>;

    }

    interface IContractionResource extends IResourceService<IContraction> {
        getContractions: ng.resource.IResourceMethod<Array<IContraction>>;
        saveMultipleContractions: ng.resource.IResourceMethod<Array<IContraction>>;
        getContractionsByDeliveryInActivePhase: ng.resource.IResourceMethod<IContractionList>;
        getContractionsForGraph: ng.resource.IResourceMethod<IContractionListGraph>;
        checkContractionsByDeliveryAndDateTime: ng.resource.IResourceMethod<IContractionValidation>;
        getContractionsByDeliveryIdAndDate: ng.resource.IResourceMethod<Array<IContraction>>;
        getMissingContractions: ng.resource.IResourceMethod<Array<IContractionView>>;
    }

    class ContractionService extends EntityService<IContraction, string, IContractionResource> implements IContractionService {

        static $inject = ["ContractionResource"];
        constructor(private resource: IContractionResource) {
            super(resource);
        }

        getContractions = (deliveryId: string): ng.IPromise<Array<IContraction>> => {
            return this.getResource().getContractions({ deliveryId: deliveryId }).$promise;
        }

        saveMultipleContractions = (contractionsList: Array<IContraction>): ng.IPromise<Array<IContraction>> => {
            return this.getResource().saveMultipleContractions(contractionsList).$promise;
        }

        getContractionsByDeliveryInActivePhase = (deliveryId: string, from: string, to: string): ng.IPromise<IContractionList> => {
            return this.getResource().getContractionsByDeliveryInActivePhase({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }

        getContractionsForGraph = (deliveryId: string, from: string, to: string): ng.IPromise<IContractionListGraph> => {
            return this.getResource().getContractionsForGraph({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }
        checkContractionsByDeliveryAndDateTime = (deliveryId: string, date: string): ng.IPromise<IContractionList> => {
            return this.getResource().checkContractionsByDeliveryAndDateTime({ deliveryId: deliveryId, date: date }).$promise;
        }

        getContractionsByDeliveryIdAndDate = (deliveryId: string, date: string): ng.IPromise<Array<IContraction>> => {
            return this.getResource().getContractionsByDeliveryIdAndDate({ deliveryId: deliveryId, date: date }).$promise;
        }

        getMissingContractions = (deliveryId: string, start: string, end: string, interval: number): ng.IPromise<Array<IContractionView>> => {
            return this.getResource().getMissingContractions({ deliveryId: deliveryId, start: start, end: end, interval: interval }).$promise;
        }

    }

    app.factory("ContractionResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IContractionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/contractions/:id");

            return <IContractionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getContractions": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/contractions/deliveries/:deliveryId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
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
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
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
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "saveMultipleContractions": {
                    method: "POST", isArray: true,
                    url: mrs.config.Settings.serverResource("api/contractions/partogram/multiple-contractions"),
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.forEach(function (c: any) {
                            c.date = DateUtils.convertLocalDateTimeToServer(data.date);
                        });
                        return angular.toJson(copy);
                    }
                },
                "getContractionsByDeliveryInActivePhase": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/contractions/active-phase"),
                    method: "GET", isArray: false,
                },
                 "getContractionsForGraph": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/contractions-graph/active-phase"),
                    method: "GET", isArray: false,
                },
                "checkContractionsByDeliveryAndDateTime": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/contractions/check-contractions/:date"),
                    method: "GET", isArray: false,
                },

                "getMissingContractions": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/contractions/check-missing-contractions")
                },
                "getContractionsByDeliveryIdAndDate": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/contractions/date/:date"),
                    method: "GET",
                    isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);
    // 
    app.service("ContractionService", ContractionService);

}