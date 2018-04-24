namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHtsPurposeOfTest extends IAggregateRoot<string> {
        name: string;
    }

    export interface IHtsPurposeOfTestService extends data.IAggregateRootService<IHtsPurposeOfTest, string> {
        query: (text?: string) => ng.IPromise<Array<IHtsPurposeOfTest>>;
    }

    interface IHtsPurposeOfTestResource extends IResourceService<IHtsPurposeOfTest> {

    }

    class HtsPurposeOfTestService extends EntityService<IHtsPurposeOfTest, string, IHtsPurposeOfTestResource> implements IHtsPurposeOfTestService {

        static $inject = ["HtsPurposeOfTestResource"];
        constructor(private resource: IHtsPurposeOfTestResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IHtsPurposeOfTest>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("HtsPurposeOfTestResource", ["$resource",
        ($resource: ng.resource.IResourceService): IHtsPurposeOfTestResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/purpose-of-tests/:id");

            return <IHtsPurposeOfTestResource>$resource(resourceUrl, {}, {
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

    app.service("HtsPurposeOfTestService", HtsPurposeOfTestService);

}