namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IActivate extends ng.resource.IResourceClass<any> {

    }

    app.factory("Activate", ["$resource",
        ($resource: ng.resource.IResourceService): IActivate => {

            let resourceUrl = mrs.config.Settings.serverResource("api/activate");

            return <IActivate>$resource(resourceUrl, {}, {
                "get": { method: "GET", params: {}, isArray: false }
            });

        }]);


}
