namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILabourSummary extends IAggregateRoot<string> {
        birthPlace: string;
        labour: string;
        membraneRuptured: string;
        oxytocinIssued: string;    }

    export interface ILabourSummaryService extends data.IAggregateRootService<ILabourSummary, string> {
        query: (text?: string) => ng.IPromise<Array<ILabourSummary>>;
    }

    interface ILabourSummaryResource extends IResourceService<ILabourSummary> {

    }

    class LabourSummaryService extends EntityService<ILabourSummary, string, ILabourSummaryResource> implements ILabourSummaryService {

        static $inject = ["LabourSummaryResource"];
        constructor(private resource: ILabourSummaryResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ILabourSummary>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("LabourSummaryResource", ["$resource",
        ($resource: ng.resource.IResourceService): ILabourSummaryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/labour-summaries/:id");

            return <ILabourSummaryResource>$resource(resourceUrl, {}, {
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

    app.service("LabourSummaryService", LabourSummaryService);

}