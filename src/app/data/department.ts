namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDepartment extends IAggregateRoot<string> {
        name: string;
    }

    export interface IDepartmentService extends data.IAggregateRootService<IDepartment, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IDepartment>>;

    }

    interface IDepartmentResource extends IResourceService<IDepartment> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IDepartment>>;
    }

    class DepartmentService extends EntityService<IDepartment, string, IDepartmentResource> implements IDepartmentService {

        static $inject = ["DepartmentResource"];
        constructor(private resource: IDepartmentResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IDepartment>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("DepartmentResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDepartmentResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/departments/:id");

            return <IDepartmentResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": { method: "GET", isArray: false },
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

    app.service("DepartmentService", DepartmentService);

}