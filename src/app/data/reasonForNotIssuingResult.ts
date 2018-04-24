namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IReasonForNotIssuingResult extends IAggregateRoot<string> {

        name: string;

    }

    export interface IReasonForNotIssuingResultService extends data.IAggregateRootService<IReasonForNotIssuingResult, string> {
        query: (text?: string) => ng.IPromise<Array<IReasonForNotIssuingResult>>;
    }

    interface IReasonForNotIssuingResultResource extends IResourceService<IReasonForNotIssuingResult> {
        fetch: ng.resource.IResourceMethod<Array<IReasonForNotIssuingResult>>;
    }

    class ReasonForNotIssuingResultService extends EntityService<IReasonForNotIssuingResult, string, IReasonForNotIssuingResultResource> implements IReasonForNotIssuingResultService {

        static $inject = ["ReasonForNotIssuingResultResource"];
        constructor(private resource: IReasonForNotIssuingResultResource) {
            super(resource);
        }


        query = (text?: string, page?: IPageRequest): ng.IPromise<Array<IReasonForNotIssuingResult>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text }).$promise;
        }

    }

    app.factory("ReasonForNotIssuingResultResource", ["$resource",
        ($resource: ng.resource.IResourceService): IReasonForNotIssuingResultResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/reason-for-not-issuing-results/:id");

            return <IReasonForNotIssuingResultResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": {
                    method: "GET", isArray: true
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

    app.service("ReasonForNotIssuingResultService", ReasonForNotIssuingResultService);

}