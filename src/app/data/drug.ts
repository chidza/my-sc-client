namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDrug extends IAggregateRoot<string> {
        code: string;
        strength: number;
        drugNameId: string;
        unitId: string;
        formulationId: string;
    }

    export interface IDrugList {
        id: string;
        code: string;
        strength: number;
        formulation?: string;
        unit?: string;
    }

    export interface IDrugService extends data.IAggregateRootService<IDrug, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IDrug>>;
        getDrugs: (drugNameId: string) => ng.IPromise<Array<IDrugList>>;
    }

    interface IDrugResource extends IResourceService<IDrug> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IDrug>>;
        getByDrugNameId: ng.resource.IResourceMethod<Array<IDrug>>;
    }

    class DrugService extends EntityService<IDrug, string, IDrugResource> implements IDrugService {

        static $inject = ["DrugResource"];
        constructor(private resource: IDrugResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IDrug>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }

            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;

        }

        getDrugs = (drugNameId: string): ng.IPromise<Array<IDrugList>> => {
            return this.getResource().getByDrugNameId({ drugNameId: drugNameId }).$promise;
        }

    }

    app.factory("DrugResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDrugResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/drugs/:id");

            return <IDrugResource>$resource(resourceUrl, {}, {
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
                "getByDrugNameId": {
                    url: mrs.config.Settings.serverResource("/api/drugs/names/:drugNameId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
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

    app.service("DrugService", DrugService);

}