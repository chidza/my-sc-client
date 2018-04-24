namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonInvestigationTest extends IAggregateRoot<string> {
        date: Date;
        personInvestigationId: string;
        result: string;
        testKitBatchId: string;
        testKitId: string;
    }

    export interface IPersonInvestigationTestService extends data.IAggregateRootService<IPersonInvestigationTest, string> {
        getByPersonInvestigationId: (personInvestigationId: string) => ng.IPromise<Array<IPersonInvestigationTest>>;
        getTestKitBatchesByPersonInvestigationId: (personInvestigationId: string) => ng.IPromise<Array<ITestKitBatch>>;
        getTestKitsByPersonInvestigationId: (personInvestigationId: string) => ng.IPromise<Array<ITestKit>>;
        getTestKitBatchesByInvestigationId: (investigationId: string) => ng.IPromise<Array<ITestKitBatch>>;
        getTestKitsByInvestigationId: (investigationId: string) => ng.IPromise<Array<ITestKit>>;
    }

    interface IPersonInvestigationTestResource extends IResourceService<IPersonInvestigationTest> {
        getByPersonInvestigationId: ng.resource.IResourceMethod<Array<IPersonInvestigationTest>>;
        getTestKitBatchesByPersonInvestigationId: ng.resource.IResourceMethod<Array<ITestKitBatch>>;
        getTestKitsByPersonInvestigationId: ng.resource.IResourceMethod<Array<ITestKit>>;

        getTestKitBatchesByInvestigationId: ng.resource.IResourceMethod<Array<ITestKitBatch>>;
        getTestKitsByInvestigationId: ng.resource.IResourceMethod<Array<ITestKit>>;
    }

    class PersonInvestigationTestService extends EntityService<IPersonInvestigationTest, string, IPersonInvestigationTestResource> implements IPersonInvestigationTestService {

        static $inject = ["PersonInvestigationTestResource"];
        constructor(private resource: IPersonInvestigationTestResource) {
            super(resource);
        }

        getByPersonInvestigationId = (personInvestigationId: string): ng.IPromise<Array<IPersonInvestigationTest>> => {
            return this.getResource().getByPersonInvestigationId({ personInvestigationId: personInvestigationId }).$promise;
        }
        getTestKitBatchesByPersonInvestigationId = (personInvestigationId: string): ng.IPromise<Array<ITestKitBatch>> => {
            return this.getResource().getTestKitBatchesByPersonInvestigationId({ personInvestigationId: personInvestigationId }).$promise;
        }
        getTestKitsByPersonInvestigationId = (personInvestigationId: string): ng.IPromise<Array<ITestKit>> => {
            return this.getResource().getTestKitsByPersonInvestigationId({ personInvestigationId: personInvestigationId }).$promise;
        }
        getTestKitBatchesByInvestigationId = (investigationId: string): ng.IPromise<Array<ITestKitBatch>> => {
            return this.getResource().getTestKitBatchesByInvestigationId({ investigationId: investigationId }).$promise;
        }
        getTestKitsByInvestigationId = (investigationId: string): ng.IPromise<Array<ITestKit>> => {
            return this.getResource().getTestKitsByInvestigationId({ investigationId: investigationId }).$promise;
        }
    }

    app.factory("PersonInvestigationTestResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPersonInvestigationTestResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-investigation-tests/:id");

            return <IPersonInvestigationTestResource>$resource(resourceUrl, {}, {
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
                "getByPersonInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/person-investigation-tests/getByPersonInvestigationId/:personInvestigationId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "getTestKitBatchesByPersonInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/person-investigation-tests/getTestKitBatchesByPersonInvestigationId/:personInvestigationId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "getTestKitsByPersonInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/person-investigation-tests/getTestKitsByPersonInvestigationId/:personInvestigationId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "getTestKitBatchesByInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/person-investigation-tests/getTestKitBatchesByInvestigationId/:investigationId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "getTestKitsByInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/person-investigation-tests/getTestKitsByInvestigationId/:investigationId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("PersonInvestigationTestService", PersonInvestigationTestService);

}