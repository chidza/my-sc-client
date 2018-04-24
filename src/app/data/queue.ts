namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IQueue extends IAggregateRoot<string> {
        departmentId: string;
        name: string;
    }

    export interface IQueueList extends IAggregateRoot<string> {
        id: string;
        name?: string;
        departmentName?: string;
        count?: number;
    }

    export interface IQueueService extends data.IAggregateRootService<IQueue, string> {
        getAll(page: IPageRequest): ng.IPromise<IPageReponse<IQueueList>>;
    }

    interface IQueueResource extends IResourceService<IQueue> {
        getAll: ng.resource.IResourceMethod<IPageReponse<IQueueList>>;
    }

    class QueueService extends EntityService<IQueue, string, IQueueResource> implements IQueueService {

        static $inject = ["QueueResource", "$q", "DepartmentService"];
        constructor(private resource: IQueueResource,
            private q: ng.IQService,
            private departmentService: IDepartmentService) {
            super(resource);
        }

        getAll(page: IPageRequest): ng.IPromise<IPageReponse<IQueueList>> {
            return this.getResource().getAll({ page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("QueueResource", ["$resource",
        ($resource: ng.resource.IResourceService): IQueueResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/queues/:id");

            return <IQueueResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getAll": {
                    method: "GET", isArray: false
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

    app.service("QueueService", QueueService);

}