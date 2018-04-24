namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHtsReasonForNotIssuingResult extends IAggregateRoot<string> {
        name: string;
    }

    export interface IHtsReasonForNotIssuingResultService extends data.IAggregateRootService<IHtsReasonForNotIssuingResult, string> {
        query: (text?: string) => ng.IPromise<Array<IHtsReasonForNotIssuingResult>>;
    }

    interface IHtsReasonForNotIssuingResultResource extends IResourceService<IHtsReasonForNotIssuingResult> {

    }

    class HtsReasonForNotIssuingResultService extends EntityService<IHtsReasonForNotIssuingResult, string, IHtsReasonForNotIssuingResultResource> implements IHtsReasonForNotIssuingResultService {

        static $inject = ["HtsReasonForNotIssuingResultResource"];
        constructor(private resource: IHtsReasonForNotIssuingResultResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IHtsReasonForNotIssuingResult>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("HtsReasonForNotIssuingResultResource", ["$resource",
        ($resource: ng.resource.IResourceService): IHtsReasonForNotIssuingResultResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/reason-for-not-issuing-results/:id");


            return <IHtsReasonForNotIssuingResultResource>$resource(resourceUrl, {}, {
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

    app.service("HtsReasonForNotIssuingResultService", HtsReasonForNotIssuingResultService);

}