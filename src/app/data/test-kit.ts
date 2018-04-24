
namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITestKit extends IAggregateRoot<string> {
        name: string;
    }

    export interface ITestKitService extends data.IAggregateRootService<ITestKit, string> {
    }

    interface ITestKitResource extends IResourceService<ITestKit> {
    }

    class TestKitService extends EntityService<ITestKit, string, ITestKitResource> implements ITestKitService {

        static $inject = ["TestKitResource"];
        constructor(private resource: ITestKitResource) {
            super(resource);
        }


    }

    app.factory("TestKitResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITestKitResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/test-kits/:id");

            return <ITestKitResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/test-kits/:investigationId"),
                    method: "GET", isArray: true
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

    app.service("TestKitService", TestKitService);

}