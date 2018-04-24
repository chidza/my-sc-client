namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILabTest extends IAggregateRoot<string> {
        name: string;
        code: string;
        standardId: string;
    }

    export interface ILabTestService extends data.IAggregateRootService<ILabTest, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<Array<ILabTest>>;
    }

    interface ILabTestResource extends IResourceService<ILabTest> {

    }

    class LabTestService extends EntityService<ILabTest, string, ILabTestResource> implements ILabTestService {

        static $inject = ["LabTestResource"];
        constructor(private resource: ILabTestResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<Array<ILabTest>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().query({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("LabTestResource", ["$resource",
        ($resource: ng.resource.IResourceService): ILabTestResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/lab-tests/:id");

            return <ILabTestResource>$resource(resourceUrl, {}, {
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

    app.service("LabTestService", LabTestService);

}