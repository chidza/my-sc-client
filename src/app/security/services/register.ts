namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IRegister extends ng.resource.IResourceClass<any> {

    }

    app.factory("Register", ["$resource",
        ($resource: ng.resource.IResourceService): IRegister => {

            let resourceUrl = mrs.config.Settings.serverResource("api/register");

            return <IRegister>$resource(resourceUrl, {}, {});

        }]);

}