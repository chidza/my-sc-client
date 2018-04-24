namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDrugOption extends IAggregateRoot<string> {
        suffixId: string;
        drugNameId: string;
    }

    export interface IOptiondrug {
        id: string;
        value: string;
    }

    export interface IDrugOptionService extends data.IAggregateRootService<IDrugOption, string> {
        query: (text?: string) => ng.IPromise<Array<IDrugOption>>;
        getDrugOptionsByDrugNameId: (drugNameId: string) => ng.IPromise<Array<IDrugOption>>;
    }

    interface IDrugOptionResource extends IResourceService<IDrugOption> {
        getDrugOptionsByDrugNameId: ng.resource.IResourceArrayMethod<IDrugOption>;

    }

    class DrugOptionService extends EntityService<IDrugOption, string, IDrugOptionResource> implements IDrugOptionService {

        static $inject = ["DrugOptionResource"];
        constructor(private resource: IDrugOptionResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDrugOption>> => {
            return this.getResource().query({ text: text }).$promise;
        }

        getDrugOptionsByDrugNameId = (drugNameId: string): ng.IPromise<Array<IDrugOption>> => {
            return this.getResource().getDrugOptionsByDrugNameId({ drugNameId: drugNameId }).$promise;
        }

    }

    app.factory("DrugOptionResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDrugOptionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/drug-options/:id");

            return <IDrugOptionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "getDrugOptionsByDrugNameId": {
                    url: mrs.config.Settings.serverResource("api/drug-names/:drugNameId/drug-options"),
                    method: "GET", isArray: true,
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

    app.service("DrugOptionService", DrugOptionService);

}