namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IRelationShipTypes extends IAggregateRoot<string> {
        name: string;
    }

    export interface IRelationShipTypesService extends data.IAggregateRootService<IRelationShipTypes, string> {
        query(text?: string): ng.IPromise<Array<IRelationShipTypes>>;
    }

    interface IRelationShipTypesResource extends IResourceService<IRelationShipTypes> {
        fetch: ng.resource.IResourceMethod<Array<IRelationShipTypes>>;
    }

    class RelationShipTypesService extends EntityService<IRelationShipTypes, string, IRelationShipTypesResource> implements IRelationShipTypesService {

        static $inject = ["RelationShipTypesResource", "$http"];
        constructor(private resource: IRelationShipTypesResource,
            private http: ng.IHttpService) {
            super(resource);
        }
        query = (text?: string): ng.IPromise<Array<IRelationShipTypes>> => {
            return this.getResource().query({ text: text }).$promise;
        }


    }

    app.factory("RelationShipTypesResource", ["$resource",
        ($resource: ng.resource.IResourceService): IRelationShipTypesResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/relationship-types/:id");

            return <IRelationShipTypesResource>$resource(resourceUrl, {}, {
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

    app.service("RelationShipTypesService", RelationShipTypesService);

}