namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ISample extends IAggregateRoot<string> {
        name: string;
        standardId: string;
    }

    export interface ISampleService extends data.IAggregateRootService<ISample, string> {

        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<ISample>>;
        sampleTests: (sampleId: string) => ng.IPromise<Array<ILabTest>>;
        investigation: (sampleId: string, testId: string) => ng.IPromise<IInvestigation>;
    }

    interface ISampleResource extends IResourceService<ISample> {
        fetch: ng.resource.IResourceMethod<IPageReponse<ISample>>;
        sampleTests: ng.resource.IResourceMethod<Array<ILabTest>>;
        investigation: ng.resource.IResourceMethod<IInvestigation>;
    }

    class SampleService extends EntityService<ISample, string, ISampleResource> implements ISampleService {

        static $inject = ["SampleResource"];
        constructor(private resource: ISampleResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<ISample>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        sampleTests = (sampleId: string): ng.IPromise<Array<ILabTest>> => {
            return this.getResource().sampleTests({ id: sampleId }).$promise;
        }

        investigation = (sampleId: string, testId: string): ng.IPromise<IInvestigation> => {
            return this.getResource().investigation({ id: sampleId, testId: testId }).$promise;
        }

    }

    app.factory("SampleResource", ["$resource",
        ($resource: ng.resource.IResourceService): ISampleResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/samples/:id");

            return <ISampleResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": { method: "GET", isArray: false },
                "sampleTests": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/samples/:id/tests"),
                    isArray: true
                },
                "investigation": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/samples/:id/tests/:testId")
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

    app.service("SampleService", SampleService);

}