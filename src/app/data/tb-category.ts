namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITbCategory extends IAggregateRoot<string> {
        highRisk: boolean;
        maxDuration: number;
        minDuration: number;
        name: string;
    }

    export interface ITbCategoryService extends data.IAggregateRootService<ITbCategory, string> {
        query: (text?: string) => ng.IPromise<Array<ITbCategory>>;
    }

    interface ITbCategoryResource extends IResourceService<ITbCategory> {

    }

    class TbCategoryService extends EntityService<ITbCategory, string, ITbCategoryResource> implements ITbCategoryService {

        static $inject = ["TbCategoryResource"];
        constructor(private resource: ITbCategoryResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IEducationLevel>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("TbCategoryResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITbCategoryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/tb-categories/:id");

            return <ITbCategoryResource>$resource(resourceUrl, {}, {
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
            });

        }]);

    app.service("TbCategoryService", TbCategoryService);

}