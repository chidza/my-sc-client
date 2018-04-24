namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IOpdQueue extends IAggregateRoot<string> {
        date: Date;
        queueId: string;
        personId: string;
    }

    export interface IOpdQueueService extends data.IAggregateRootService<IOpdQueue, string> {
        people(queueId: string): ng.IPromise<Array<IPerson>>;
        queues(personId: string): ng.IPromise<Array<IQueue>>;
        removePersonFromQueue(personId: string, queueId: string): ng.IPromise<IQueue>;
        addPersonToQueue(personId: string, queueId: string): ng.IPromise<IQueue>;
    }

    interface IOpdQueueResource extends IResourceService<IOpdQueue> {
        people: ng.resource.IResourceArrayMethod<IPerson>;
        queues: ng.resource.IResourceArrayMethod<IQueue>;
        removePersonFromQueue: ng.resource.IResourceMethod<IQueue>;
        addPersonToQueue: ng.resource.IResourceMethod<IQueue>;
    }

    class OpdQueueService extends EntityService<IOpdQueue, string, IOpdQueueResource> implements IOpdQueueService {

        static $inject = ["OpdQueueResource"];
        constructor(private resource: IOpdQueueResource) {
            super(resource);
        }

        people = (queueId: string): ng.IPromise<Array<IPerson>> => {
            return this.getResource().people({ queueId: queueId }).$promise;
        }

        queues = (personId: string): ng.IPromise<Array<IQueue>> => {
            return this.getResource().queues({ personId: personId }).$promise;
        }

        removePersonFromQueue = (personId: string, queueId: string): ng.IPromise<IQueue> => {
            return this.getResource().removePersonFromQueue({ personId: personId, queueId: queueId }, {}).$promise;
        }

         addPersonToQueue = (personId: string, queueId: string): ng.IPromise<IQueue> => {
            return this.getResource().addPersonToQueue({ personId: personId, queueId: queueId }, {}).$promise;
        }

    }

    app.factory("OpdQueueResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IOpdQueueResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/opd-queues/:id");

            return <IOpdQueueResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "people": {
                    url: mrs.config.Settings.serverResource("api/opd-queues/people/:queueId"),
                    method: "GET", isArray: true
                },
                "queues": {
                    url: mrs.config.Settings.serverResource("api/opd-queues/queues/:personId"),
                    method: "GET", isArray: true
                },
                "removePersonFromQueue": {
                    url: mrs.config.Settings.serverResource("api/opd-queues/people/:personId/:queueId/remove"),
                    method: "POST",
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("OpdQueueService", OpdQueueService);

}