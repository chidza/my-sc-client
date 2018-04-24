namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFacility extends IAggregateRoot<string> {
        name: string;

    }

    export interface IFacilityService extends data.IAggregateRootService<IFacility, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IFacility>>;
    }

    interface IFacilityResource extends IResourceService<IFacility> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IFacility>>;
    }

    class FacilityService extends EntityService<IFacility, string, IFacilityResource> implements IFacilityService {

        static $inject = ["FacilityResource"];
        constructor(private resource: IFacilityResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IFacility>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("FacilityResource", ["$resource",
        ($resource: ng.resource.IResourceService): IFacilityResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/facilities/:id");

            return <IFacilityResource>$resource(resourceUrl, {}, {
                "query": {
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
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

    app.service("FacilityService", FacilityService);

}