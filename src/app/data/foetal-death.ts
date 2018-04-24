namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFoetalDeath extends IAggregateRoot<string> {

        diagnosisId: string;
        gender: string;
        infantId: string;
        stillBirthType: string;
        time: Date;

    }

    export interface IFoetalDeathService extends data.IAggregateRootService<IFoetalDeath, string> {
        getByInfantId: (infantId: string) => ng.IPromise<IFoetalDeath>;
    }

    interface IFoetalDeathResource extends IResourceService<IFoetalDeath> {
        getByInfantId: ng.resource.IResourceMethod<IFoetalDeath>;
    }

    class FoetalDeathService extends EntityService<IFoetalDeath, string, IFoetalDeathResource> implements IFoetalDeathService {

        static $inject = ["FoetalDeathResource"];
        constructor(private resource: IFoetalDeathResource) {
            super(resource);
        }

        getByInfantId = (infantId: string): ng.IPromise<IFoetalDeath> => {
            return this.getResource().getByInfantId({ infantId: infantId }).$promise;
        }

    }

    app.factory("FoetalDeathResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IFoetalDeathResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/foetal-deaths/:id");

            return <IFoetalDeathResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByInfantId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/foetal-deaths/infants/:infantId"),
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
                        copy.date = DateUtils.convertLocalDateTimeToServer(copy.time);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
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
                        copy.date = DateUtils.convertLocalDateTimeToServer(copy.time);
                        return angular.toJson(copy);
                    },
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

    app.service("FoetalDeathService", FoetalDeathService);

}