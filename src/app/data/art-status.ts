namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtStatus extends IAggregateRoot<string> {
        name: String;
    }

    export interface IArtStatusService extends data.IAggregateRootService<IArtStatus, string> {
        query: (text?: string) => ng.IPromise<Array<IArtStatus>>;
    }

    interface IArtStatusResource extends IResourceService<IArtStatus> {

    }

    class ArtStatusService extends EntityService<IArtStatus, string, IArtStatusResource> implements IArtStatusService {

        static $inject = ["ArtStatusResource"];
        constructor(private resource: IArtStatusResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IArtStatus>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("ArtStatusResource", ["$resource",
        ($resource: ng.resource.IResourceService): IArtStatusResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/art-statuses/:id");

            return <IArtStatusResource>$resource(resourceUrl, {}, {
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

    app.service("ArtStatusService", ArtStatusService);

}