namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IStandard extends IAggregateRoot<string> {
        name: string;
    }

    export interface IStandardService extends data.IAggregateRootService<IStandard, string> {
        query: (text?: string) => ng.IPromise<Array<IStandard>>;
    }

    interface IStandardResource extends IResourceService<IStandard> {

    }

    class StandardService extends EntityService<IStandard, string, IStandardResource> implements IStandardService {

        static $inject = ["StandardResource"];
        constructor(private resource: IStandardResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IStandard>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("StandardResource", ["$resource",
        ($resource: ng.resource.IResourceService): IStandardResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/standards/:id");

            return <IStandardResource>$resource(resourceUrl, {}, {
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

    app.service("StandardService", StandardService);

}