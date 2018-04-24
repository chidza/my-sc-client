namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IIdentity extends ng.resource.IResource<IIdentity> {
        login: string;
        firstName: string;
        lastName: string;
        email: string;
        activated: boolean;
        langKey: string;
        authorities: string[];
        password: string;
    }

    export interface IAccount extends ng.resource.IResourceClass<IIdentity> {

    }

    app.factory("Account", ["$resource",
        ($resource: ng.resource.IResourceService): IAccount => {

            let resourceUrl = mrs.config.Settings.serverResource("api/account");

            return <IAccount>$resource(resourceUrl, {}, {
                "get": {
                    method: "GET", params: {}, isArray: false,
                    interceptor: {
                        response: (response: any) => {
                            // expose response
                            return response;
                        }
                    }
                }
            });

        }]);


}

