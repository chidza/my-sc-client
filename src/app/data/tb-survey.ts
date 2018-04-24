namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITbSurvey extends IAggregateRoot<string> {
        tbId: string;
        tbQuestionareId: string;
        value: string;
    }

    export interface ITbSurveyService extends data.IAggregateRootService<ITbSurvey, string> {
        getByTbId: (tbId: string) => ng.IPromise<Array<ITbSurvey>>;
        add: (tbId: string, questionId: string) => ng.IPromise<ITbSurvey>;
        removeQuestion: (tbId: string, questionId: string) => ng.IPromise<ITbSurvey>;
    }

    interface ITbSurveyResource extends IResourceService<ITbSurvey> {
        getByTbId: ng.resource.IResourceMethod<Array<ITbSurvey>>;
    }

    class TbSurveyService extends EntityService<ITbSurvey, string, ITbSurveyResource> implements ITbSurveyService {

        static $inject = ["TbSurveyResource", "$q"];
        constructor(private resource: ITbSurveyResource,
            private q: ng.IQService) {
            super(resource);
        }

        getByTbId = (tbId: string): ng.IPromise<Array<ITbSurvey>> => {
            return this.getResource().getByTbId({ tbId: tbId }).$promise;
        }

        add = (tbId: string, questionId: string): ng.IPromise<ITbSurvey> => {
            return this.getResource().save({
                tbId: tbId,
                tbQuestionareId: questionId,
                value: "YES"
            }).$promise;
        }

        removeQuestion = (tbId: string, questionId: string): ng.IPromise<ITbSurvey> => {
            let d = this.q.defer();

            this.getByTbId(tbId).then((response) => {

                response.forEach((survey) => {
                    if (survey.tbQuestionareId === questionId) {

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

    app.factory("TbSurveyResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITbSurveyResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/tb-surveys/:id");

            return <ITbSurveyResource>$resource(resourceUrl, {}, {
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
                "getByTbId": {
                    url: mrs.config.Settings.serverResource("api/tb-surveys/getByTbId/:tbId"),
                    method: "GET", isArray: true
                }
            });

        }]);

    app.service("TbSurveyService", TbSurveyService);

}