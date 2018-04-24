namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IImnciCategory extends IAggregateRoot<string> {
        name: string;
    }

    export interface IImnciCategoryService extends data.IAggregateRootService<IImnciCategory, string> {

    }

    interface IImnciCategoryResource extends IResourceService<IImnciCategory> {
    }

    class ImnciCategoryService extends EntityService<IImnciCategory, string, IImnciCategoryResource> implements IImnciCategoryService {

        static $inject = ["ImnciCategoryResource"];
        constructor(private resource: IImnciCategoryResource) {
            super(resource);
        }

    }

    app.factory("ImnciCategoryResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IImnciCategoryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-categories/:id");

            return <IImnciCategoryResource>$resource(resourceUrl, {}, {
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

    app.service("ImnciCategoryService", ImnciCategoryService);

}