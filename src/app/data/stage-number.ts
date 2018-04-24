namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IStageNumber extends IAggregateRoot<string> {
        name: string;
    }

    export interface IStageNumberService extends data.IAggregateRootService<IStageNumber, string> {
        query: (text?: string) => ng.IPromise<Array<IStageNumber>>;
    }

    interface IStageNumberResource extends IResourceService<IStageNumber> {

    }

    class StageNumberService extends EntityService<IStageNumber, string, IStageNumberResource> implements IStageNumberService {

        static $inject = ["StageNumberResource"];
        constructor(private resource: IStageNumberResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IStageNumber>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("StageNumberResource", ["$resource",
        ($resource: ng.resource.IResourceService): IStageNumberResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/stage-numbers/:id");

            return <IStageNumberResource>$resource(resourceUrl, {}, {
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

    app.service("StageNumberService", StageNumberService);

}