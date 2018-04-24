namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFunctionalStatus extends IAggregateRoot<string> {
        name: String;
    }

    export interface IFunctionalStatusService extends data.IAggregateRootService<IFunctionalStatus, string> {
        query: (text?: string) => ng.IPromise<Array<IFunctionalStatus>>;
    }

    interface IFunctionalStatusResource extends IResourceService<IFunctionalStatus> {

    }

    class FunctionalStatusService extends EntityService<IFunctionalStatus, string, IFunctionalStatusResource> implements IFunctionalStatusService {

        static $inject = ["FunctionalStatusResource"];
        constructor(private resource: IFunctionalStatusResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IFunctionalStatus>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("FunctionalStatusResource", ["$resource",
        ($resource: ng.resource.IResourceService): IFunctionalStatusResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/functional-statuses/:id");

            return <IFunctionalStatusResource>$resource(resourceUrl, {}, {
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

    app.service("FunctionalStatusService", FunctionalStatusService);

}