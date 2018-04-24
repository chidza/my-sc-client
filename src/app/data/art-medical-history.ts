namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtMedicalHistory extends IAggregateRoot<string> {
        artId: string;
        artQuestionareId: string;
    }

    export interface IArtMedicalHistoryService extends data.IAggregateRootService<IArtMedicalHistory, string> {
        getByArtId: (artId: string) => ng.IPromise<Array<IArtMedicalHistory>>;
        removeQuestion: (artId: string, questionId: string) => ng.IPromise<IArtMedicalHistory>;
    }

    interface IArtMedicalHistoryResource extends IResourceService<IArtMedicalHistory> {
        getByArtId: ng.resource.IResourceMethod<Array<IArtMedicalHistory>>;
    }

    class ArtMedicalHistoryService extends EntityService<IArtMedicalHistory, string, IArtMedicalHistoryResource> implements IArtMedicalHistoryService {

        static $inject = ["ArtMedicalHistoryResource", "$q"];
        constructor(private resource: IArtMedicalHistoryResource,
            private q: ng.IQService
        ) {
            super(resource);
        }

        getByArtId = (artId: string): ng.IPromise<Array<IArtMedicalHistory>> => {
            return this.getResource().getByArtId({ artId: artId }).$promise;
        }

        removeQuestion = (artId: string, questionId: string): ng.IPromise<IArtMedicalHistory> => {
            let d = this.q.defer();

            this.getByArtId(artId).then((response) => {

                response.forEach((survey) => {
                    if (survey.artQuestionareId === questionId) {

                        this.remove(survey.id);

                        d.resolve(survey);
                    }
                });

            }, (e) => {
                d.reject(e);
            });


            return d.promise;
        }

    }

    app.factory("ArtMedicalHistoryResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtMedicalHistoryResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-medical-histories/:id");

            return <IArtMedicalHistoryResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByArtId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/art-medical-histories/getByArtId/:artId")
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

    app.service("ArtMedicalHistoryService", ArtMedicalHistoryService);

}