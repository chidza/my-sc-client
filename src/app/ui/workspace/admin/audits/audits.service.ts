namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAuditLog extends ng.resource.IResource<IAuditLog> {
        timestamp: Date;
        principal: string;
        type: string;
        data: string;
    }

    export interface IAuditsService extends ng.resource.IResourceClass<IAuditLog> {
    }

    app.factory("AuditsService", ["$resource",
        ($resource: ng.resource.IResourceService): IAuditsService => {

            let resourceUrl = mrs.config.Settings.serverResource("management/audits/:id");

            return <IAuditsService>$resource(resourceUrl, {}, {
                "get": {
                    method: "GET",
                    isArray: true
                },
                "query": {
                    method: "GET",
                    isArray: true,
                    params: { fromDate: null, toDate: null }
                }
            });

        }]);

}