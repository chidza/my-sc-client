namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtCurrentSign extends IAggregateRoot<string> {
        artId: string;
        artQuestionareId: string;
    }

    export interface IArtCurrentSignService extends data.IAggregateRootService<IArtCurrentSign, string> {
        getByArtId: (artId: string) => ng.IPromise<Array<IArtCurrentSign>>;
    }

    interface IArtCurrentSignResource extends IResourceService<IArtCurrentSign> {
        getByArtId: ng.resource.IResourceMethod<Array<IArtCurrentSign>>;
    }

    class ArtCurrentSignService extends EntityService<IArtCurrentSign, string, IArtCurrentSignResource> implements IArtCurrentSignService {

        static $inject = ["ArtCurrentSignResource"];
        constructor(private resource: IArtCurrentSignResource) {
            super(resource);
        }

        getByArtId = (artId: string): ng.IPromise<Array<IArtCurrentSign>> => {
            return this.getResource().getByArtId({ artId: artId }).$promise;
        }

    }

    app.factory("ArtCurrentSignResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtCurrentSignResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-current-signs/:id");

            return <IArtCurrentSignResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByArtId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/art-current-signs/getByArtId/:artId")
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

    app.service("ArtCurrentSignService", ArtCurrentSignService);

}