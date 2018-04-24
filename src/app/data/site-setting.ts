namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ISiteSetting extends IAggregateRoot<string> {
        meta: string;
        name: string;
        value: string;
    }

    export interface ICurrentTime extends IAggregateRoot<string> {
        currentTime: string;
    }

    export interface ISiteSettingService extends data.IAggregateRootService<ISiteSetting, string> {
        fetch: (name: string) => ng.IPromise<ISiteSetting>;
        query: (text?: string) => ng.IPromise<Array<ISiteSetting>>;
        getSiteSetting: (name: string) => ng.IPromise<ISiteSetting>;
        currentTime: () => ng.IPromise<ICurrentTime>;
    }

    interface ISiteSettingResource extends IResourceService<ISiteSetting> {
        fetch: ng.resource.IResourceMethod<ISiteSetting>;
        getSiteSetting: ng.resource.IResourceMethod<ISiteSetting>;
        currentTime: ng.resource.IResourceMethod<ICurrentTime>;
    }

    class SiteSettingService extends EntityService<ISiteSetting, string, ISiteSettingResource> implements ISiteSettingService {

        static $inject = ["SiteSettingResource"];
        constructor(private resource: ISiteSettingResource) {
            super(resource);
        }

        fetch = (name: string): ng.IPromise<ISiteSetting> => {
            return this.getResource().fetch({ name: name }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<ISiteSetting>> => {
            return this.getResource().query({ text: text }).$promise;
        }
        getSiteSetting = (name: string): ng.IPromise<ISiteSetting> => {
            return this.getResource().getSiteSetting({ name: name }).$promise;
        }

        currentTime = (): ng.IPromise<ICurrentTime> => {
            return this.getResource().currentTime().$promise;
        }

    }

    app.factory("SiteSettingResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): ISiteSettingResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/site-settings/:id");

            return <ISiteSettingResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "currentTime": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/site-settings/current-time")
                },
                "fetch": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/site-settings/:name")
                },
                "getSiteSetting": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/site-settings/:name")
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("SiteSettingService", SiteSettingService);

}