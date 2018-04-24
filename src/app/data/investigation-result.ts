namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IInvestigationResult extends IAggregateRoot<string> {
        createdDate: Date;
        diagnoses: IDiagnosis[];
        investigationId: string;
        resultId: string;
    }

    export interface IResult extends IAggregateRoot<string> {
        name: string;
        diagnoses: IDiagnosis[];
    }

    export interface IInvestigationResultService extends data.IAggregateRootService<IInvestigationResult, string> {
        getResultByInvestigationId: (investigationId: string) => ng.IPromise<Array<IResult>>;
        getResultByInvestigationIds: (investigationIds: string[]) => ng.IPromise<Array<IResult>>;
    }

    interface IInvestigationResultResource extends IResourceService<IInvestigationResult> {
        getResultByInvestigationId: ng.resource.IResourceMethod<Array<IResult>>;
        getResultByInvestigationIds: ng.resource.IResourceMethod<Array<IResult>>;
    }

    class InvestigationResultService extends EntityService<IInvestigationResult, string, IInvestigationResultResource> implements IInvestigationResultService {

        static $inject = ["InvestigationResultResource", "$http"];
        constructor(private resource: IInvestigationResultResource,
            private http: ng.IHttpService) {
            super(resource);
        }

        getResultByInvestigationId = (investigationId: string): ng.IPromise<Array<IResult>> => {
            return this.getResource().getResultByInvestigationId({ investigationId: investigationId }).$promise;
        }
        getResultByInvestigationIds = (investigationIds: string[]): ng.IPromise<Array<IResult>> => {
            return this.getResource().getResultByInvestigationIds({ investigationId: investigationIds.join(",") }).$promise;
        }

    }

    app.factory("InvestigationResultResource", ["$resource",
        ($resource: ng.resource.IResourceService): IInvestigationResultResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/investigation-results/:id");

            return <IInvestigationResultResource>$resource(resourceUrl, {}, {
                "query": {
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
                "update": { method: "PUT" },
                "getResultByInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/investigation/:investigationId/investigation-results"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "getResultByInvestigationIds": {
                    url: mrs.config.Settings.serverResource("api/lab-results/investigations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("InvestigationResultService", InvestigationResultService);

}