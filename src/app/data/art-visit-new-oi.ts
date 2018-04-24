namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtVisitNewOi extends IAggregateRoot<string> {
        artQuestionareId: string;
        artVisitId: string;
    }

    export interface IArtVisitNewOiService extends data.IAggregateRootService<IArtVisitNewOi, string> {
        getByArtVisitId: (artVisitId: string) => ng.IPromise<Array<IArtVisitNewOi>>;
    }

    interface IArtVisitNewOiResource extends IResourceService<IArtVisitNewOi> {
        getByArtVisitId: ng.resource.IResourceMethod<Array<IArtVisitNewOi>>;
    }

    class ArtVisitNewOiService extends EntityService<IArtVisitNewOi, string, IArtVisitNewOiResource> implements IArtVisitNewOiService {

        static $inject = ["ArtVisitNewOiResource"];
        constructor(private resource: IArtVisitNewOiResource) {
            super(resource);
        }

        getByArtVisitId = (artVisitId: string): ng.IPromise<Array<IArtVisitNewOi>> => {
            return this.getResource().getByArtVisitId({ artVisitId: artVisitId }).$promise;
        }

    }

    app.factory("ArtVisitNewOiResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtVisitNewOiResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-visit-new-ois/:id");

            return <IArtVisitNewOiResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByArtVisitId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/art-visit-new-ois/getByVisitArtId/:artVisitId")
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.birthdate = dateUtils.convertLocalDateFromServer(data.birthdate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ArtVisitNewOiService", ArtVisitNewOiService);

}