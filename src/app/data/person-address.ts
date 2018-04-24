namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonAddress extends IAggregateRoot<string> {
        townId: string;
        street: string;
        city: string;
        personId: string;
    }

    export interface IPersonAddressService extends data.IAggregateRootService<IPersonAddress, string> {
        query: (text?: string) => ng.IPromise<Array<IPersonAddress>>;
        getByPersonId: (personId: string) => ng.IPromise<Array<IPersonAddress>>;
    }

    interface IPersonAddressResource extends IResourceService<IPersonAddress> {
        getByPersonId: ng.resource.IResourceArrayMethod<IPersonAddress>;
    }

    class PersonAddressService extends EntityService<IPersonAddress, string, IPersonAddressResource> implements IPersonAddressService {

        static $inject = ["PersonAddressResource"];
        constructor(private resource: IPersonAddressResource) {
            super(resource);
        }

        getByPersonId = (personId: string): ng.IPromise<Array<IPersonAddress>> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<IPersonAddress>> => {
            return this.getResource().query({ text: name }).$promise;
        }
    }

    app.factory("PersonAddressResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPersonAddressResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/addresses/:id");

            return <IPersonAddressResource>$resource(resourceUrl, {}, {
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
                "getByPersonId": {
                    url: mrs.config.Settings.serverResource("api/addresses/people/:personId"),
                    method: "GET", isArray: true
                },
                "update": { method: "PUT" }
            });

        }]);

    app.service("PersonAddressService", PersonAddressService);

}