namespace mrs.security {
    "use strict";

      let app = angular.module(mrs.appName);

    export interface ISession extends ng.resource.IResourceClass<any> {

    }

    app.factory("Sessions", ["$resource",
        ($resource: ng.resource.IResourceService): ISession => {

            let resourceUrl = mrs.config.Settings.serverResource("api/account/sessions/:series");

            return <ISession>$resource(resourceUrl, {}, {
                 "getAll": { method: "GET", isArray: true}
            });

        }]);  

}
