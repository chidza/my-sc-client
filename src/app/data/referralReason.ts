namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IReferralReason extends IAggregateRoot<string> {
        name: string;

    }

    export interface IReferralReasonService extends data.IAggregateRootService<IReferralReason, string> {
        query: (text?: string) => ng.IPromise<Array<IReferralReason>>;
    }

    interface IReferralReasonResource extends IResourceService<IReferralReason> {

    }

    class ReferralReasonService extends EntityService<IReferralReason, string, IReferralReasonResource> implements IReferralReasonService {

        static $inject = ["ReferralReasonResource"];
        constructor(private resource: IReferralReasonResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IReferralReason>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("ReferralReasonResource", ["$resource",
        ($resource: ng.resource.IResourceService): IReferralReasonResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/referral-reasons/:id");

            return <IReferralReasonResource>$resource(resourceUrl, {}, {
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

    app.service("ReferralReasonService", ReferralReasonService);

}