namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IUnit extends IAggregateRoot<string> {
        code: string;
        name: string;
        description?: string;
        standardId: string;
    }

    export interface IUnitService extends data.IAggregateRootService<IUnit, string> {
        query: (text?: string) => ng.IPromise<Array<IUnit>>;
    }

    interface IUnitResource extends IResourceService<IUnit> {

    }

    class UnitService extends EntityService<IUnit, string, IUnitResource> implements IUnitService {

        static $inject = ["UnitResource"];
        constructor(private resource: IUnitResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IUnit>> => {
            return this.getResource().query({ text: text }).$promise;
        }

    }

    app.factory("UnitResource", ["$resource",
        ($resource: ng.resource.IResourceService): IUnitResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/units/:id");

            return <IUnitResource>$resource(resourceUrl, {}, {
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

    app.service("UnitService", UnitService);

}