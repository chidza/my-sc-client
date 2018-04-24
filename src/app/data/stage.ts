namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IStage extends IAggregateRoot<string> {
        startDate: Date;
        startTime: Date;
        endDate: Date;
        endTime: Date;
        deliveryId: string;
        stageNumberId?: string;
        duration?: number;

    }

    export interface IStageService extends data.IAggregateRootService<IStage, string> {
        fetch: (deliveryId: string) => ng.IPromise<Array<IStage>>;
        getStagesByDeliveryId: (deliveryId: string) => ng.IPromise<Array<IStage>>;
    }

    interface IStageResource extends IResourceService<IStage> {
        fetch: ng.resource.IResourceMethod<Array<IStage>>;
        getStagesByDeliveryId: ng.resource.IResourceMethod<Array<IStage>>;

    }

    class StageService extends EntityService<IStage, string, IStageResource> implements IStageService {

        static $inject = ["StageResource"];
        constructor(private resource: IStageResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IStage>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        fetch = (deliveryId: string): ng.IPromise<Array<IStage>> => {
            return this.getResource().query({ deliveryId: deliveryId }).$promise;
        }

        getStagesByDeliveryId = (deliveryId: string): ng.IPromise<Array<IStage>> => {
            return this.getResource().getStagesByDeliveryId({ deliveryId: deliveryId }).$promise;
        }

    }

    app.factory("StageResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IStageResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/stages/:id");

            return <IStageResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "fetch": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/stages/:deliveryId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.startDate = DateUtils.convertLocalDateFromServer(data.startDate);
                            data.startTime = DateUtils.convertDateTimeFromServer(data.startTime);
                            data.endDate = DateUtils.convertLocalDateFromServer(data.endDate);
                            data.endTime = DateUtils.convertDateTimeFromServer(data.endTime);
                        }
                        return data;
                    }
                }, "getStagesByDeliveryId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/stages/deliveries/:deliveryId")
                },

                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.startDate = DateUtils.convertLocalDateFromServer(data.startDate);
                            data.startTime = DateUtils.convertDateTimeFromServer(data.startTime);
                            data.endDate = DateUtils.convertLocalDateFromServer(data.endDate);
                            data.endTime = DateUtils.convertDateTimeFromServer(data.endTime);
                        }
                        return data;
                    }
                },

                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.startDate = DateUtils.convertLocalDateToServer(copy.startDate);
                        copy.endDate = DateUtils.convertLocalDateToServer(copy.endDate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.startDate = DateUtils.convertLocalDateToServer(copy.startDate);
                        copy.endDate = DateUtils.convertLocalDateToServer(copy.endDate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("StageService", StageService);

}