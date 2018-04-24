namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IInvestigation extends IAggregateRoot<string> {
        sampleId: string;
        testId: string;
    }

    export interface IInvestigationService extends data.IAggregateRootService<IInvestigation, string> {
        fetch: (text?: string, page?: number, size?: number, sort?: any) => ng.IPromise<Array<IInvestigation>>;
    }

    interface IInvestigationResource extends IResourceService<IInvestigation> {

    }

    class InvestigationService extends EntityService<IInvestigation, string, IInvestigationResource> implements IInvestigationService {

        static $inject = ["InvestigationResource", "$http"];
        constructor(private resource: IInvestigationResource,
            private http: ng.IHttpService) {
            super(resource);
        }

        fetch = (text?: string, page?: number, size?: number, sort?: any): ng.IPromise<Array<IInvestigation>> => {
            let resourceUrl = mrs.config.Settings.serverResource("api/investigations");
            return this.getResource().query({
                text: text, page: page, size: size
            }).$promise;
        }

    }

    app.factory("InvestigationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IInvestigationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/investigations/:id");

            return <IInvestigationResource>$resource(resourceUrl, {}, {
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
                "update": { method: "PUT" }
            });

        }]);

    app.service("InvestigationService", InvestigationService);

}