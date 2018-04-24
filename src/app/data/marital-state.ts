namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMaritalState extends IAggregateRoot<string> {
        name: string;
    }

    export interface IMaritalStateService extends data.IAggregateRootService<IMaritalState, string> {
        query: (text?: string) => ng.IPromise<Array<IMaritalState>>;
    }

    interface IMaritalStateResource extends IResourceService<IMaritalState> {

    }

    class MaritalStateService extends EntityService<IMaritalState, string, IMaritalStateResource> implements IMaritalStateService {

        static $inject = ["MaritalStateResource"];
        constructor(private resource: IMaritalStateResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IMaritalState>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("MaritalStateResource", ["$resource",
        ($resource: ng.resource.IResourceService): IMaritalStateResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/marital-states/:id");

            return <IMaritalStateResource>$resource(resourceUrl, {}, {
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

    app.service("MaritalStateService", MaritalStateService);

}