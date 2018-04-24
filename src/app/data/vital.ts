namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IVital extends IAggregateRoot<string> {

        name: string;
        code: string;
        minimum: number;
        maximum: number;
        standardId: string;
        unitId: string;
    }

    export interface IVitalService extends data.IAggregateRootService<IVital, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IVital>>;
    }

    interface IVitalResource extends IResourceService<IVital> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IVital>>;
    }

    class VitalService extends EntityService<IVital, string, IVitalResource> implements IVitalService {

        static $inject = ["VitalResource"];
        constructor(private resource: IVitalResource) {
            super(resource);
        }


        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IVital>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("VitalResource", ["$resource",
        ($resource: ng.resource.IResourceService): IVitalResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/vitals/:id");

            return <IVitalResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": {
                    method: "GET", isArray: false
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

    app.service("VitalService", VitalService);

}