namespace mrs.data {
    "use strict";
    let app = angular.module(mrs.appName);
    export interface IZepiDrugName extends IAggregateRoot<string> {
        alias: string;
        discontinued: boolean;
        drugNameId: string;
    }
    export interface IZepiDrugNameService extends data.IAggregateRootService<IZepiDrugName, string> {
        query: (text?: string) => ng.IPromise<Array<IZepiDrugName>>;
        getZepiDrugNames: () => ng.IPromise<Array<IDrugName>>;
    }
    interface IZepiDrugNameResource extends IResourceService<IZepiDrugName> {
        getZepiDrugNames: ng.resource.IResourceArrayMethod<IDrugName>;
    }
    class ZepiDrugNameService extends EntityService<IZepiDrugName, string, IZepiDrugNameResource> implements IZepiDrugNameService {
        static $inject = ["ZepiDrugNameResource"];
        constructor(private resource: IZepiDrugNameResource) {
            super(resource);
        }
        query = (text?: string): ng.IPromise<Array<IZepiDrugName>> => {
            return this.getResource().query({ text: name }).$promise;
        }
        getZepiDrugNames = (): ng.IPromise<Array<IDrugName>> => {
            return this.getResource().getZepiDrugNames().$promise;
        }
    }
    app.factory("ZepiDrugNameResource", ["$resource",
        ($resource: ng.resource.IResourceService): IZepiDrugNameResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/zepi-drug-names/:id");
            return <IZepiDrugNameResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getZepiDrugNames": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/zepi/drug-names")
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
    app.service("ZepiDrugNameService", ZepiDrugNameService);
}