namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncProperty extends IAggregateRoot<string> {
        pncVisitId: string;
        pncQuestionareId: string;
        value: string;
    }

    export interface IPncPropertyService extends data.IAggregateRootService<IPncProperty, string> {
        getByPncVisitId: (pncVisitId: string) => ng.IPromise<Array<IPncProperty>>;
        add: (pncVisitId: string, questionId: string) => ng.IPromise<IPncProperty>;
        removeQuestion: (pncVisitId: string, questionId: string) => ng.IPromise<IPncProperty>;
    }

    interface IPncPropertyResource extends IResourceService<IPncProperty> {
        getByPncVisitId: ng.resource.IResourceMethod<Array<IPncProperty>>;
    }

    class PncPropertyService extends EntityService<IPncProperty, string, IPncPropertyResource> implements IPncPropertyService {

        static $inject = ["PncPropertyResource", "$q"];
        constructor(private resource: IPncPropertyResource,
            private q: ng.IQService) {
            super(resource);
        }

        getByPncVisitId = (pncVisitId: string): ng.IPromise<Array<IPncProperty>> => {
            return this.getResource().getByPncVisitId({ pncVisitId: pncVisitId }).$promise;
        }

        add = (pncVisitId: string, questionId: string): ng.IPromise<IPncProperty> => {
            return this.getResource().save({
                pncVisitId: pncVisitId,
                pncQuestionareId: questionId,
                value: "YES"
            }).$promise;
        }

        removeQuestion = (pncVisitId: string, questionId: string): ng.IPromise<IPncProperty> => {
            let d = this.q.defer();

            this.getByPncVisitId(pncVisitId).then((response) => {

                response.forEach((survey) => {
                    if (survey.pncQuestionareId === questionId) {

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

    app.factory("PncPropertyResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPncPropertyResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pnc-properties/:id");

            return <IPncPropertyResource>$resource(resourceUrl, {}, {
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
                "getByPncVisitId": {

                    url: mrs.config.Settings.serverResource("api/pnc-properties/pncs/:pncVisitId"),
                    method: "GET", isArray: true
                }
            });

        }]);

    app.service("PncPropertyService", PncPropertyService);

}