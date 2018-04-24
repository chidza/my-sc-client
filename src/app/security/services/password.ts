namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPassword extends ng.resource.IResourceClass<any> {

    }

    app.factory("Password", ["$resource",
        ($resource: ng.resource.IResourceService): IPassword => {

            let resourceUrl = mrs.config.Settings.serverResource("api/account/change_password");

            return <IPassword>$resource(resourceUrl, {}, {});

        }]);

}