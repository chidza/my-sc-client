namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAncQuestionaire extends IAggregateRoot<string> {
        name: string;
        type: string;

    }
    export interface IAncQuestionaireData extends IAggregateRoot<string> {
        ancQuestionareId: string;
        ancId: string;

    }

    export interface IAncQuestionaireService extends data.IAggregateRootService<IAncQuestionaire, string> {
        query: (text?: string) => ng.IPromise<Array<IAncQuestionaire>>;
        getByType(type: string): ng.IPromise<Array<IAncQuestionaire>>;
    }

    interface IAncQuestionaireResource extends IResourceService<IAncQuestionaire> {
        getByType: ng.resource.IResourceMethod<Array<IAncQuestionaire>>;
    }

    class AncQuestionaireService extends EntityService<IAncQuestionaire, string, IAncQuestionaireResource> implements IAncQuestionaireService {

        static $inject = ["AncQuestionaireResource"];
        constructor(private resource: IAncQuestionaireResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IAncQuestionaire>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByType = (type: string): ng.IPromise<Array<IAncQuestionaire>> => {
            return this.getResource().getByType({ type: type }).$promise;
        }

    }

    app.factory("AncQuestionaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IAncQuestionaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/anc-questionares/:id");

            return <IAncQuestionaireResource>$resource(resourceUrl, {}, {
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
                    url: mrs.config.Settings.serverResource("api/anc-questionares/getByType/:type"),
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

    app.service("AncQuestionaireService", AncQuestionaireService);

}