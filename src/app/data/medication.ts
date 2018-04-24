namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDrugName extends IAggregateRoot<string> {
        name: string;
        code: string;
        standardId: string;
        alias: string;
    }

    export interface IDrugNameService extends data.IAggregateRootService<IDrugName, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IDrugName>>;
        getDrugName: (drugNameId: string) => ng.IPromise<IDrugName>;
    }

    interface DrugNameResource extends IResourceService<IDrugName> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IDrugName>>;
        getDrugName: ng.resource.IResourceMethod<IDrugName>;

    }

    class DrugNameService extends EntityService<IDrugName, string, DrugNameResource> implements IDrugNameService {

        static $inject = ["MedicationResource"];
        constructor(private resource: DrugNameResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IDrugName>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getDrugName = (drugNameId: string): ng.IPromise<IDrugName> => {
            return this.getResource().getDrugName({ drugNameId: drugNameId }).$promise;
        }

    }

    app.factory("MedicationResource", ["$resource",
        ($resource: ng.resource.IResourceService): DrugNameResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/drug-names/:id");

            return <DrugNameResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": { method: "GET", isArray: false },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "getDrugName": {
                    url: mrs.config.Settings.serverResource("api/drug-names/:drugNameId"),
                    method: "GET", isArray: false,
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

    app.service("DrugNameService", DrugNameService);

}

