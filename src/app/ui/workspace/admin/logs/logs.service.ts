namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILogger extends ng.resource.IResource<ILogger> {
        name: string;
        level: string;
    }

    export interface ILogsService extends ng.resource.IResourceClass<ILogger> {
        findAll: ng.resource.IResourceArrayMethod<ILogger>;
        changeLevel: ng.resource.IResourceMethod<ILogger>;
    }

    app.factory("LogsService", ["$resource",
        ($resource: ng.resource.IResourceService): ILogsService => {

            let resourceUrl = mrs.config.Settings.serverResource("management/logs");

            return <ILogsService>$resource(resourceUrl, {}, {
                "findAll": { method: "GET", isArray: true },
                "changeLevel": { method: "PUT" }
            });

        }]);

}
