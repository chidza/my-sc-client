namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPasswordResetFinish extends ng.resource.IResourceClass<any> {

    }

    app.factory("PasswordResetFinish", ["$resource",
        ($resource: ng.resource.IResourceService): IPasswordResetFinish => {

            let resourceUrl = mrs.config.Settings.serverResource("api/account/reset_password/finish");

            return <IPasswordResetFinish>$resource(resourceUrl, {}, {});

        }]);

}