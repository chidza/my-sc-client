namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDeliveryType extends IAggregateRoot<string> {
        name: string;
    }

    export interface IDeliveryTypeService extends data.IAggregateRootService<IDeliveryType, string> {
        query: (text?: string) => ng.IPromise<Array<IDeliveryType>>;
    }

    interface IDeliveryTypeResource extends IResourceService<IDeliveryType> {

    }

    class DeliveryTypeService extends EntityService<IDeliveryType, string, IDeliveryTypeResource> implements IDeliveryTypeService {

        static $inject = ["DeliveryTypeResource"];
        constructor(private resource: IDeliveryTypeResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDeliveryType>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("DeliveryTypeResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDeliveryTypeResource => {

            let resourceUrl = mrs.config.Settings.serverResource("/api/delivery-types/:id");

            return <IDeliveryTypeResource>$resource(resourceUrl, {}, {
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

    app.service("DeliveryTypeService", DeliveryTypeService);

}