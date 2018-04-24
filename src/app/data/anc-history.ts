namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAncHistory extends IAggregateRoot<string> {
        ancId: string;
        ancQuestionareId: string;
        value: string;
    }

    export interface IAncHistoryService extends data.IAggregateRootService<IAncHistory, string> {
        getByAncId: (ancId: string) => ng.IPromise<Array<IAncHistory>>;
        add: (ancId: string, questionId: string) => ng.IPromise<IAncHistory>;
        removeQuestion: (ancId: string, questionId: string) => ng.IPromise<IAncHistory>;
    }

    interface IAncHistoryResource extends IResourceService<IAncHistory> {
        getByAncId: ng.resource.IResourceMethod<Array<IAncHistory>>;
    }

    class AncHistoryService extends EntityService<IAncHistory, string, IAncHistoryResource> implements IAncHistoryService {

        static $inject = ["AncHistoryResource", "$q"];
        constructor(private resource: IAncHistoryResource,
            private q: ng.IQService) {
            super(resource);
        }

        getByAncId = (ancId: string): ng.IPromise<Array<IAncHistory>> => {
            return this.getResource().getByAncId({ ancId: ancId }).$promise;
        }

        add = (ancId: string, questionId: string): ng.IPromise<IAncHistory> => {
            return this.getResource().save({
                ancId: ancId,
                ancQuestionareId: questionId,
                value: "YES"
            }).$promise;
        }

        removeQuestion = (ancId: string, questionId: string): ng.IPromise<IAncHistory> => {
            let d = this.q.defer();

            this.getByAncId(ancId).then((response) => {

                response.forEach((survey) => {
                    if (survey.ancQuestionareId === questionId) {

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

    app.factory("AncHistoryResource", ["$resource",
        ($resource: ng.resource.IResourceService): IAncHistoryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/anc-histories/:id");

            return <IAncHistoryResource>$resource(resourceUrl, {}, {
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
                ,
                "getByAncId": {

                    url: mrs.config.Settings.serverResource("api/anc-histories/:ancId/survey"),
                    method: "GET", isArray: true
                }
            });

        }]);

    app.service("AncHistoryService", AncHistoryService);

}