namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDrugBatch extends IAggregateRoot<string> {
        batchNumber: string;
        dateReceived: Date;
        drugId: string;
        expiryDate: Date;
        quantity: number;
        supplierId: string;
    }

    export interface IDrugBatchService extends data.IAggregateRootService<IDrugBatch, string> {
        query: (text?: string) => ng.IPromise<Array<IDrugBatch>>;
        getByDrugId: (drugId: string) => ng.IPromise<Array<IDrugBatch>>;
    }

    interface IDrugBatchResource extends IResourceService<IDrugBatch> {
        getByDrugId: ng.resource.IResourceArrayMethod<IDrugBatch>;
    }

    class DrugBatchService extends EntityService<IDrugBatch, string, IDrugBatchResource> implements IDrugBatchService {

        static $inject = ["DrugBatchResource"];
        constructor(private resource: IDrugBatchResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDrugBatch>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByDrugId = (drugId: string): ng.IPromise<Array<IDrugBatch>> => {
            return this.getResource().getByDrugId({ drugId: drugId }).$promise;
        }

    }

    app.factory("DrugBatchResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IDrugBatchResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/drug-batches/:id");

            return <IDrugBatchResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByDrugId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/drug/:drugId/drug-batches"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.dateReceived = dateUtils.convertLocalDateFromServer(data.dateReceived);
                            data.expiryDate = dateUtils.convertLocalDateFromServer(data.expiryDate);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.dateReceived = dateUtils.convertLocalDateFromServer(data.dateReceived);
                            data.expiryDate = dateUtils.convertLocalDateFromServer(data.expiryDate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.dateReceived = dateUtils.convertLocalDateToServer(copy.dateReceived);
                        copy.expiryDate = dateUtils.convertLocalDateToServer(copy.expiryDate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.dateReceived = dateUtils.convertLocalDateToServer(copy.dateReceived);
                        copy.expiryDate = dateUtils.convertLocalDateToServer(copy.expiryDate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("DrugBatchService", DrugBatchService);

}