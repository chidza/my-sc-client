namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITbQuestionaire extends IAggregateRoot<string> {
        name: string;
        type: string;

    }
    export interface ITbQuestionaireData extends IAggregateRoot<string> {
        TbQuestionareId: string;
        TbId: string;

    }

    export interface ITbQuestionaireService extends data.IAggregateRootService<ITbQuestionaire, string> {
        query: (text?: string) => ng.IPromise<Array<ITbQuestionaire>>;
        getByType(type: string): ng.IPromise<Array<ITbQuestionaire>>;
    }

    interface ITbQuestionaireResource extends IResourceService<ITbQuestionaire> {
        getByType: ng.resource.IResourceMethod<Array<ITbQuestionaire>>;
    }

    class TbQuestionaireService extends EntityService<ITbQuestionaire, string, ITbQuestionaireResource> implements ITbQuestionaireService {

        static $inject = ["TbQuestionaireResource"];
        constructor(private resource: ITbQuestionaireResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ITbQuestionaire>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByType = (type: string): ng.IPromise<Array<ITbQuestionaire>> => {
            return this.getResource().getByType({ type: type }).$promise;
        }

    }

    app.factory("TbQuestionaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): ITbQuestionaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/tb-questionares/:id");

            return <ITbQuestionaireResource>$resource(resourceUrl, {}, {
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
                    url: mrs.config.Settings.serverResource("api/tb-questionares/getByType/:type"),
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

    app.service("TbQuestionaireService", TbQuestionaireService);

}