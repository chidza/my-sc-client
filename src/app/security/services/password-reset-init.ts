namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPasswordResetInit extends ng.resource.IResourceClass<any> {

    }

    app.factory("PasswordResetInit", ["$resource",
        ($resource: ng.resource.IResourceService): IPasswordResetInit => {

            let resourceUrl = mrs.config.Settings.serverResource("api/account/reset_password/init");

            return <IPasswordResetInit>$resource(resourceUrl, {}, {});

        }]);

}