namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHtsModel extends IAggregateRoot<string> {
        name: string;
    }

    export interface IHtsModelService extends data.IAggregateRootService<IHtsModel, string> {
        query: (text?: string) => ng.IPromise<Array<IHtsModel>>;
    }

    interface IHtsModelResource extends IResourceService<IHtsModel> {

    }

    class HtsModelService extends EntityService<IHtsModel, string, IHtsModelResource> implements IHtsModelService {

        static $inject = ["HtsModelResource"];
        constructor(private resource: IHtsModelResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IHtsModel>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("HtsModelResource", ["$resource",
        ($resource: ng.resource.IResourceService): IHtsModelResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/hts-models/:id");

            return <IHtsModelResource>$resource(resourceUrl, {}, {
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

    app.service("HtsModelService", HtsModelService);

}