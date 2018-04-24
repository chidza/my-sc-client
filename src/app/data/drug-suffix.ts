namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDrugSuffix extends IAggregateRoot<string> {
        code: string;
        name: string;
        description?: string;
        standardId: string;
    }

    export interface IDrugSuffixService extends data.IAggregateRootService<IDrugSuffix, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<Array<IDrugSuffix>>;
    }

    interface IDrugSuffixResource extends IResourceService<IDrugSuffix> {

    }

    class DrugSuffixService extends EntityService<IDrugSuffix, string, IDrugSuffixResource> implements IDrugSuffixService {

        static $inject = ["DrugSuffixResource"];
        constructor(private resource: IDrugSuffixResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<Array<IDrugSuffix>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().query({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("DrugSuffixResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDrugSuffixResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/drug-suffixes/:id");

            return <IDrugSuffixResource>$resource(resourceUrl, {}, {
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

    app.service("DrugSuffixService", DrugSuffixService);

}