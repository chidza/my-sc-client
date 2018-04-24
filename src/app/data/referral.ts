namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IReferral extends IAggregateRoot<string> {
        encounterId: string;
        facilityId: string;
        note: string;
        reasonId: string;

    }

    export interface IReferralService extends data.IAggregateRootService<IReferral, string> {
        query: (text?: string) => ng.IPromise<Array<IReferral>>;
    }

    interface IReferralResource extends IResourceService<IReferral> {

    }

    class ReferralService extends EntityService<IReferral, string, IReferralResource> implements IReferralService {

        static $inject = ["ReferralResource"];
        constructor(private resource: IReferralResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IReferral>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("ReferralResource", ["$resource",
        ($resource: ng.resource.IResourceService): IReferralResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/referrals/:id");

            return <IReferralResource>$resource(resourceUrl, {}, {
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

    app.service("ReferralService", ReferralService);

}