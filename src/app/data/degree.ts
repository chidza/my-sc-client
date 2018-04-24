namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDegree extends IAggregateRoot<string> {
        name: string;
    }

    export interface IDegreeService extends data.IAggregateRootService<IDegree, string> {
        query: (text?: string) => ng.IPromise<Array<IDegree>>;
    }

    interface IDegreeResource extends IResourceService<IDegree> {

    }

    class DegreeService extends EntityService<IDegree, string, IDegreeResource> implements IDegreeService {

        static $inject = ["DegreeResource"];
        constructor(private resource: IDegreeResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDegree>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("DegreeResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDegreeResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/degrees/:id");

            return <IDegreeResource>$resource(resourceUrl, {}, {
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

    app.service("DegreeService", DegreeService);

}