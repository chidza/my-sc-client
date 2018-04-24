namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDistrict extends IAggregateRoot<string> {
        provinceId: string;
        name: string;

    }

    export interface IDistrictService extends data.IAggregateRootService<IDistrict, string> {
        getByProvince(provinceId: string): ng.IPromise<Array<IDistrict>>;
    }

    interface IDistrictResource extends IResourceService<IDistrict> {
        getByProvince: ng.resource.IResourceArrayMethod<IDistrict>;
    }

    class DistrictService extends EntityService<IDistrict, string, IDistrictResource> implements IDistrictService {

        static $inject = ["DistrictResource"];
        constructor(private resource: IDistrictResource) {
            super(resource);
        }

        getByProvince = (provinceId: string): ng.IPromise<Array<IDistrict>> => {
            return this.getResource().getByProvince({ provinceId: provinceId }).$promise;
        }


    }

    app.factory("DistrictResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDistrictResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/districts/:id");

            return <IDistrictResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByProvince": {
                    url: mrs.config.Settings.serverResource("api/provinces/:provinceId/districts"),
                    method: "GET", isArray: true
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

    app.service("DistrictService", DistrictService);

}