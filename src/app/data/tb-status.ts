namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITbStatus extends IAggregateRoot<string> {
        name: String;
    }

    export interface ITbStatusService extends data.IAggregateRootService<ITbStatus, string> {
        query: (text?: string) => ng.IPromise<Array<ITbStatus>>;
    }

    interface ITbStatusResource extends IResourceService<ITbStatus> {

    }

    class TbStatusService extends EntityService<ITbStatus, string, ITbStatusResource> implements ITbStatusService {

        static $inject = ["TbStatusResource"];
        constructor(private resource: ITbStatusResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ITbStatus>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("TbStatusResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITbStatusResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/tb-statuses/:id");

            return <ITbStatusResource>$resource(resourceUrl, {}, {
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

    app.service("TbStatusService", TbStatusService);

}