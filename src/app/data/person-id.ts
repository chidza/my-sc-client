namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonId extends IAggregateRoot<string> {
        personId: string;
        number: string;
        typeId: string;
    }

    export interface IPersonIdService extends data.IAggregateRootService<IPersonId, string> {
        query: (text?: string) => ng.IPromise<Array<IPersonId>>;
        getByPersonId: (personId: string) => ng.IPromise<Array<IPersonId>>;
    }

    interface IPersonIdResource extends IResourceService<IPersonId> {
        getByPersonId: ng.resource.IResourceArrayMethod<IPersonId>;
    }

    class PersonIdService extends EntityService<IPersonId, string, IPersonIdResource> implements IPersonIdService {

        static $inject = ["PersonIdResource"];
        constructor(private resource: IPersonIdResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPersonId>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByPersonId = (personId: string): ng.IPromise<Array<IPersonId>> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

    }

    app.factory("PersonIdResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPersonIdResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-ids/:id");

            return <IPersonIdResource>$resource(resourceUrl, {}, {
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
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);

                        return angular.toJson(copy);
                    }
                },
                "getByPersonId": {
                    url: mrs.config.Settings.serverResource("/api/person-ids/people/:personId"),
                    method: "GET", isArray: true
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);

                        return angular.toJson(copy);
                    }
                }

            });

        }]);

    app.service("PersonIdService", PersonIdService);

}