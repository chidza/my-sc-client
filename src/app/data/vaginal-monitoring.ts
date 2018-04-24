namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IVaginalMonitoring extends IAggregateRoot<string> {

        amnioticFluidId: string;
        caputId: string;
        deliveryId: string;
        id: string;
        mouldingId: string;
        date: Date;
        time: Date;

    }
    export interface IVaginalMonitoringView extends IAggregateRoot<string> {
        time: Date;
        amniotic: string;
        moulding: string;
        caput: string;

    }

    export interface IPartogramView
        extends ng.resource.IResource<IPartogramView> {
        times: Array<string>;
        amniotic: Array<IPartogramViewData>;
        moulding: Array<IPartogramViewData>;
        caput: Array<IPartogramViewData>;
    }

    export interface IPartogramViewData {
        time: string;
        result: string;
        status: string;
    }

    export interface IVaginalStatus
        extends ng.resource.IResource<IVaginalStatus> {
        amniotic: string;
        moulding: string;
        caput: string;
    }

    export interface IVaginalRecording
        extends ng.resource.IResource<IVaginalRecording> {
        time: string;
        status: string;
    }
    export interface IVaginalMonitoringService extends data.IAggregateRootService<IVaginalMonitoring, string> {
        fetch: (deliveryId: string) => ng.IPromise<Array<IVaginalMonitoring>>;
        getForPartogram: (deliveryId: string, from: string, to: string) => ng.IPromise<Array<IVaginalMonitoringView>>;
        getPartogramView: (deliveryId: string, from: string, to: string) => ng.IPromise<IPartogramView>;
        checkVaginal: (deliveryId: string, vaginalId: string) => ng.IPromise<IVaginalStatus>;
        getByDate: (deliveryId: string, date: string) => ng.IPromise<IVaginalMonitoring>;
        checkMissingRecordings: (deliveryId: string, start: string, end: string) => ng.IPromise<Array<IVaginalMonitoringView>>;

    }

    interface IVaginalMonitoringResource extends IResourceService<IVaginalMonitoring> {
        fetch: ng.resource.IResourceMethod<Array<IVaginalMonitoring>>;
        getForPartogram: ng.resource.IResourceMethod<Array<IVaginalMonitoringView>>;
        getPartogramView: ng.resource.IResourceMethod<IPartogramView>;
        checkVaginal: ng.resource.IResourceMethod<IVaginalStatus>;
        getByDate: ng.resource.IResourceMethod<IVaginalMonitoring>;
        checkMissingRecordings: ng.resource.IResourceMethod<Array<IVaginalMonitoringView>>;
    }

    class VaginalMonitoringService extends EntityService<IVaginalMonitoring, string, IVaginalMonitoringResource> implements IVaginalMonitoringService {

        static $inject = ["VaginalResource"];
        constructor(private resource: IVaginalMonitoringResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IVaginalMonitoring>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        fetch = (deliveryId: string): ng.IPromise<Array<IVaginalMonitoring>> => {
            return this.getResource().fetch({ deliveryId: deliveryId }).$promise;
        }

        getForPartogram = (deliveryId: string, from: string, to: string): ng.IPromise<Array<IVaginalMonitoringView>> => {
            return this.getResource().getForPartogram({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }

        getPartogramView = (deliveryId: string, from: string, to: string): ng.IPromise<IPartogramView> => {
            return this.getResource().getPartogramView({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }

        checkVaginal = (deliveryId: string, vaginalId: string): ng.IPromise<IVaginalStatus> => {
            return this.getResource().checkVaginal({ deliveryId: deliveryId, vaginalId: vaginalId }).$promise;
        }

        getByDate = (deliveryId: string, date: string): ng.IPromise<IVaginalMonitoring> => {
            return this.getResource().getByDate({ deliveryId: deliveryId, date: date }).$promise;
        }

        checkMissingRecordings = (deliveryId: string, start: string, end: string): ng.IPromise<Array<IVaginalMonitoringView>> => {
            return this.getResource().checkMissingRecordings({ deliveryId: deliveryId, start: start, end: end }).$promise;
        }

    }

    app.factory("VaginalResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IVaginalMonitoringResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/vaginal-monitorings/:id");

            return <IVaginalMonitoringResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "fetch": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/vaginal-monitorings/delivery/:deliveryId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getByDate": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/vaginal-monitorings"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getForPartogram": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/vaginal-monitoring"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "checkVaginal": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/vaginal-monitoring/:vaginalId/check-vaginal")
                }, "checkMissingRecordings": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/vaginal-monitoring/check-missing-information")
                },
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
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:ss"));
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
                }
                ,
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:ss"));
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
                }
            });
        }
    ]);

    app.service("VaginalMonitoringService", VaginalMonitoringService);

}