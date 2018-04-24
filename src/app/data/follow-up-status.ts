namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFollowUpStatus extends IAggregateRoot<string> {
        name: String;
    }

    export interface IFollowUpStatusService extends data.IAggregateRootService<IFollowUpStatus, string> {
        query: (text?: string) => ng.IPromise<Array<IFollowUpStatus>>;
    }

    interface IFollowUpStatusResource extends IResourceService<IFollowUpStatus> {

    }

    class FollowUpStatusService extends EntityService<IFollowUpStatus, string, IFollowUpStatusResource> implements IFollowUpStatusService {

        static $inject = ["FollowUpStatusResource"];
        constructor(private resource: IFollowUpStatusResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IFollowUpStatus>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("FollowUpStatusResource", ["$resource",
        ($resource: ng.resource.IResourceService): IFollowUpStatusResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/follow-up-statuses/:id");

            return <IFollowUpStatusResource>$resource(resourceUrl, {}, {
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

    app.service("FollowUpStatusService", FollowUpStatusService);

}