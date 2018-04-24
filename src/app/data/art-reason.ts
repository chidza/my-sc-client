namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtReason extends IAggregateRoot<string> {
        artStatusId: string;
        name: string;
    }

    export interface IArtReasonService extends data.IAggregateRootService<IArtReason, string> {
        getByStatusId: (artStatusId: string) => ng.IPromise<Array<IArtReason>>;
    }

    interface IArtReasonResource extends IResourceService<IArtReason> {
        getByStatusId: ng.resource.IResourceMethod<Array<IArtReason>>;
    }

    class ArtReasonService extends EntityService<IArtReason, string, IArtReasonResource> implements IArtReasonService {

        static $inject = ["ArtReasonResource"];
        constructor(private resource: IArtReasonResource) {
            super(resource);
        }

        getByStatusId = (artStatusId: string): ng.IPromise<Array<IArtReason>> => {
            return this.getResource().getByStatusId({ artStatusId: artStatusId }).$promise;
        }
    }

    app.factory("ArtReasonResource", ["$resource",
        ($resource: ng.resource.IResourceService): IArtReasonResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/art-reasons/:id");

            return <IArtReasonResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByStatusId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/art-reasons/getByStatusId/:artStatusId")
                },
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

    app.service("ArtReasonService", ArtReasonService);

}