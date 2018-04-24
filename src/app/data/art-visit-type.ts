namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtVisitType extends IAggregateRoot<string> {
        name: String;
    }

    export interface IArtVisitTypeService extends data.IAggregateRootService<IArtVisitType, string> {
        query: (text?: string) => ng.IPromise<Array<IArtVisitType>>;
    }

    interface IArtVisitTypeResource extends IResourceService<IArtVisitType> {

    }

    class ArtVisitTypeService extends EntityService<IArtVisitType, string, IArtVisitTypeResource> implements IArtVisitTypeService {

        static $inject = ["ArtVisitTypeResource"];
        constructor(private resource: IArtVisitTypeResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IArtVisitType>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("ArtVisitTypeResource", ["$resource",
        ($resource: ng.resource.IResourceService): IArtVisitTypeResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/art-visit-types/:id");

            return <IArtVisitTypeResource>$resource(resourceUrl, {}, {
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

    app.service("ArtVisitTypeService", ArtVisitTypeService);

}