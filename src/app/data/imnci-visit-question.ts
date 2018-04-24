namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IImnciVisitQuestion extends IAggregateRoot<string> {
        imnciVisitId: string;
        questionId: string;
        value: string;
        inputType: string;
    }

    export interface IImnciVisitQuestionService extends data.IAggregateRootService<IImnciVisitQuestion, string> {
        getByImnciVisitId(imnciVisitId: string): ng.IPromise<Array<IImnciVisitQuestion>>;
    }

    interface IImnciVisitQuestionResource extends IResourceService<IImnciVisitQuestion> {
        getByImnciVisitId: ng.resource.IResourceArrayMethod<IImnciVisitQuestion>;
    }

    class ImnciVisitQuestionService extends EntityService<IImnciVisitQuestion, string, IImnciVisitQuestionResource> implements IImnciVisitQuestionService {
        getByImnciVisitId(imnciVisitId: string): ng.IPromise<IImnciVisitQuestion[]> {
            return this.getResource().getByImnciVisitId({ imnciVisitId: imnciVisitId }).$promise;
        }


        static $inject = ["ImnciVisitQuestionResource"];
        constructor(private resource: IImnciVisitQuestionResource) {
            super(resource);
        }

    }

    app.factory("ImnciVisitQuestionResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IImnciVisitQuestionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-visit-questions/:id");

            return <IImnciVisitQuestionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByImnciVisitId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/imnci-visits/:imnciVisitId/imnci-visit-questions")
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ImnciVisitQuestionService", ImnciVisitQuestionService);

}