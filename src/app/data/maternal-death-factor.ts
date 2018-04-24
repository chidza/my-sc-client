namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMaternalDeathFactor extends IAggregateRoot<string> {
        name: string;
    }

    export interface IMaternalDeathFactorService extends data.IAggregateRootService<IMaternalDeathFactor, string> {
        query: (text?: string) => ng.IPromise<Array<IMaternalDeathFactor>>;
    }

    interface IMaternalDeathFactorResource extends IResourceService<IMaternalDeathFactor> {

    }

    class MaternalDeathFactorService extends EntityService<IMaternalDeathFactor, string, IMaternalDeathFactorResource> implements IMaternalDeathFactorService {

        static $inject = ["MaternalDeathFactorResource"];
        constructor(private resource: IMaternalDeathFactorResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IMaternalDeathFactor>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("MaternalDeathFactorResource", ["$resource",
        ($resource: ng.resource.IResourceService): IMaternalDeathFactorResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/maternal-death-factors");

            return <IMaternalDeathFactorResource>$resource(resourceUrl, {}, {
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
                "update": { method: "PUT" }
            });

        }]);

    app.service("MaternalDeathFactorService", MaternalDeathFactorService);

}