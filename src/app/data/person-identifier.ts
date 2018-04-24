namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonIdentifier extends IAggregateRoot<string> {
        name: string;
        type: string;
    }

    export interface IPersonIdentifierService extends data.IAggregateRootService<IPersonIdentifier, string> {
        query: (text?: string) => ng.IPromise<Array<IPersonIdentifier>>;
    }

    interface IPersonIdentifierResource extends IResourceService<IPersonIdentifier> {

    }

    class PersonIdentifierService extends EntityService<IPersonIdentifier, string, IPersonIdentifierResource> implements IPersonIdentifierService {

        static $inject = ["PersonIdentifierResource"];
        constructor(private resource: IPersonIdentifierResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPersonIdentifier>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("PersonIdentifierResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPersonIdentifierResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-identifiers/:id");

            return <IPersonIdentifierResource>$resource(resourceUrl, {}, {
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

    app.service("PersonIdentifierService", PersonIdentifierService);

}