namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IProvince extends IAggregateRoot<string> {
        name: string;

    }

    export interface IProvinceService extends data.IAggregateRootService<IProvince, string> {
        query: (text?: string) => ng.IPromise<Array<IProvince>>;
    }

    interface IProvinceResource extends IResourceService<IProvince> {

    }

    class ProvinceService extends EntityService<IProvince, string, IProvinceResource> implements IProvinceService {

        static $inject = ["ProvinceResource"];
        constructor(private resource: IProvinceResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IProvince>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("ProvinceResource", ["$resource",
        ($resource: ng.resource.IResourceService): IProvinceResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/provinces/:id");

            return <IProvinceResource>$resource(resourceUrl, {}, {
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

    app.service("ProvinceService", ProvinceService);

}