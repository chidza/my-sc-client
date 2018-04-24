namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtCurrentSymptom extends IAggregateRoot<string> {
        artId: string;
        artQuestionareId: string;
    }

    export interface IArtCurrentSymptomService extends data.IAggregateRootService<IArtCurrentSymptom, string> {
        getByArtId: (artId: string) => ng.IPromise<Array<IArtCurrentSymptom>>;
    }

    interface IArtCurrentSymptomResource extends IResourceService<IArtCurrentSymptom> {
        getByArtId: ng.resource.IResourceMethod<Array<IArtCurrentSymptom>>;
    }

    class ArtCurrentSymptomService extends EntityService<IArtCurrentSymptom, string, IArtCurrentSymptomResource> implements IArtCurrentSymptomService {

        static $inject = ["ArtCurrentSymptomResource"];
        constructor(private resource: IArtCurrentSymptomResource) {
            super(resource);
        }

        getByArtId = (artId: string): ng.IPromise<Array<IArtCurrentSymptom>> => {
            return this.getResource().getByArtId({ artId: artId }).$promise;
        }

    }

    app.factory("ArtCurrentSymptomResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtCurrentSymptomResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-current-symptoms/:id");

            return <IArtCurrentSymptomResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByArtId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/art-current-symptoms/getByArtId/:artId")
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

    app.service("ArtCurrentSymptomService", ArtCurrentSymptomService);

}