namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IImnciQuestionnaire extends IAggregateRoot<string> {
        categoryId: string;
        inputType: string;
        name: string;
    }

    export interface IImnciQuestionnaireService extends data.IAggregateRootService<IImnciQuestionnaire, string> {
        getByCategoryId(categoryId: string): ng.IPromise<Array<IImnciQuestionnaire>>;
    }

    interface IImnciQuestionnaireResource extends IResourceService<IImnciQuestionnaire> {
        getByCategoryId: ng.resource.IResourceArrayMethod<IImnciQuestionnaire>;
    }

    class ImnciQuestionnaireService extends EntityService<IImnciQuestionnaire, string, IImnciQuestionnaireResource> implements IImnciQuestionnaireService {
        getByCategoryId(categoryId: string): ng.IPromise<IImnciQuestionnaire[]> {
            return this.getResource().getByCategoryId({ categoryId: categoryId }).$promise;
        }


        static $inject = ["ImnciQuestionnaireResource"];
        constructor(private resource: IImnciQuestionnaireResource) {
            super(resource);
        }

    }

    app.factory("ImnciQuestionnaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IImnciQuestionnaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-questionares/:id");

            return <IImnciQuestionnaireResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByCategoryId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/imnci-categories/:categoryId/imnci-questionares")
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

    app.service("ImnciQuestionnaireService", ImnciQuestionnaireService);

}