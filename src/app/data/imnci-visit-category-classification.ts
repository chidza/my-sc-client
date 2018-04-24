namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IImnciVisitCategoryClassification extends IAggregateRoot<string> {
        categoryId: string;
        encounterDiagnosisId: string;
        imnciVisitId: string;
    }

    export interface IImnciVisitCategoryClassificationService extends data.IAggregateRootService<IImnciVisitCategoryClassification, string> {
        getByCategoryIdAndImnciVisitId(categoryId: string, imnciVisitId: string): ng.IPromise<IImnciVisitCategoryClassification>;
    }

    interface IImnciVisitCategoryClassificationResource extends IResourceService<IImnciVisitCategoryClassification> {
        getByCategoryIdAndImnciVisitId: ng.resource.IResourceMethod<IImnciVisitCategoryClassification>;
    }

    class ImnciVisitCategoryClassificationService extends EntityService<IImnciVisitCategoryClassification, string, IImnciVisitCategoryClassificationResource> implements IImnciVisitCategoryClassificationService {

        static $inject = ["ImnciVisitCategoryClassificationResource"];
        constructor(private resource: IImnciVisitCategoryClassificationResource) {
            super(resource);
        }

        getByCategoryIdAndImnciVisitId(categoryId: string, imnciVisitId: string): ng.IPromise<IImnciVisitCategoryClassification> {
            return this.getResource().getByCategoryIdAndImnciVisitId({ categoryId: categoryId, imnciVisitId: imnciVisitId }).$promise;
        }

    }

    app.factory("ImnciVisitCategoryClassificationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IImnciVisitCategoryClassificationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-classifications/:id");

            return <IImnciVisitCategoryClassificationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByCategoryIdAndImnciVisitId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/imnci-categories/:categoryId/imnci-visits/:imnciVisitId/imnci-classifications")
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

    app.service("ImnciVisitCategoryClassificationService", ImnciVisitCategoryClassificationService);

}