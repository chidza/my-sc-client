
namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITestKitBatch extends IAggregateRoot<string> {
        batchNumber: string;
        dateReceived: string;
        expiryDate: string;
        quantity: number;
        supplierId: string;
        testKitId: string;
    }

    export interface ITestKitBatchService extends data.IAggregateRootService<ITestKitBatch, string> {
        getByTestKitId: (testKitId: string) => ng.IPromise<Array<ITestKitBatch>>;
    }

    interface ITestKitBatchResource extends IResourceService<ITestKitBatch> {
        getByTestKitId: ng.resource.IResourceMethod<Array<ITestKitBatch>>;
    }

    class TestKitBatchService extends EntityService<ITestKitBatch, string, ITestKitBatchResource> implements ITestKitBatchService {

        static $inject = ["TestKitBatchResource"];
        constructor(private resource: ITestKitBatchResource) {
            super(resource);
        }

        getByTestKitId = (testKitId: string): ng.IPromise<Array<ITestKitBatch>> => {
            return this.getResource().getByTestKitId({ testKitId: testKitId }).$promise;
        }

    }

    app.factory("TestKitBatchResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITestKitBatchResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/test-kit-batches/:id");

            return <ITestKitBatchResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByTestKitId": {
                    url: mrs.config.Settings.serverResource("api/test-kit/:testKitId/test-kit-batches"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
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
                "update": { method: "PUT" }
            });

        }]);

    app.service("TestKitBatchService", TestKitBatchService);

}