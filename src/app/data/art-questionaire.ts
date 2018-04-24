namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtQuestionaire extends IAggregateRoot<string> {
        name: string;
        type: string;
        state: boolean;

    }
    export interface IArtQuestionaireData extends IAggregateRoot<string> {
        artQuestionareId: string;
        artId: string;

    }

    export interface IArtQuestionaireService extends data.IAggregateRootService<IArtQuestionaire, string> {
        query: (text?: string) => ng.IPromise<Array<IArtQuestionaire>>;
        getByType(type: string): ng.IPromise<Array<IArtQuestionaire>>;
    }

    interface IArtQuestionaireResource extends IResourceService<IArtQuestionaire> {
        getByType: ng.resource.IResourceMethod<Array<IArtQuestionaire>>;
    }

    class ArtQuestionaireService extends EntityService<IArtQuestionaire, string, IArtQuestionaireResource> implements IArtQuestionaireService {

        static $inject = ["ArtQuestionaireResource"];
        constructor(private resource: IArtQuestionaireResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IArtQuestionaire>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByType = (type: string): ng.IPromise<Array<IArtQuestionaire>> => {
            return this.getResource().getByType({ type: type }).$promise;
        }

    }

    app.factory("ArtQuestionaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IArtQuestionaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/art-questionares/:id");

            return <IArtQuestionaireResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
                ,
                "getByType": {
                    url: mrs.config.Settings.serverResource("api/art-questionares/getByType/:type"),
                    method: "GET", isArray: true
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ArtQuestionaireService", ArtQuestionaireService);

}