namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtVisitStatus extends IAggregateRoot<string> {
        name: String;
    }

    export interface IArtVisitStatusService extends data.IAggregateRootService<IArtVisitStatus, string> {
        query: (text?: string) => ng.IPromise<Array<IArtVisitStatus>>;
    }

    interface IArtVisitStatusResource extends IResourceService<IArtVisitStatus> {

    }

    class ArtVisitStatusService extends EntityService<IArtVisitStatus, string, IArtVisitStatusResource> implements IArtVisitStatusService {

        static $inject = ["ArtVisitStatusResource"];
        constructor(private resource: IArtVisitStatusResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IArtVisitStatus>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("ArtVisitStatusResource", ["$resource",
        ($resource: ng.resource.IResourceService): IArtVisitStatusResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/art-visit-statuses/:id");

            return <IArtVisitStatusResource>$resource(resourceUrl, {}, {
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

    app.service("ArtVisitStatusService", ArtVisitStatusService);

}