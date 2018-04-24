namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncQuestionaire extends IAggregateRoot<string> {
        name: string;
        type: string;
        state: boolean;

    }
    export interface IPncQuestionaireData extends IAggregateRoot<string> {
        pncQuestionareId: string;
        pncId: string;

    }

    export interface IPncQuestionaireService extends data.IAggregateRootService<IPncQuestionaire, string> {
        query: (text?: string) => ng.IPromise<Array<IPncQuestionaire>>;
        getByType(type: string): ng.IPromise<Array<IPncQuestionaire>>;
    }

    interface IPncQuestionaireResource extends IResourceService<IPncQuestionaire> {
        getByType: ng.resource.IResourceMethod<Array<IPncQuestionaire>>;
    }

    class PncQuestionaireService extends EntityService<IPncQuestionaire, string, IPncQuestionaireResource> implements IPncQuestionaireService {

        static $inject = ["PncQuestionaireResource"];
        constructor(private resource: IPncQuestionaireResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPncQuestionaire>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByType = (type: string): ng.IPromise<Array<IPncQuestionaire>> => {
            return this.getResource().getByType({ type: type }).$promise;
        }

    }

    app.factory("PncQuestionaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IPncQuestionaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pnc-questionares/:id");

            return <IPncQuestionaireResource>$resource(resourceUrl, {}, {
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
                    url: mrs.config.Settings.serverResource("api/pnc-questionares/getByType/:type"),
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

    app.service("PncQuestionaireService", PncQuestionaireService);

}