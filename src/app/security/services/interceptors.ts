namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    app.factory("notificationInterceptor", [() => {

        let service = {
            response: (response: any) => {
                let alertKey = response.headers("X-mrsApp-alert");
                if (angular.isString(alertKey)) {
                    // AlertService.success(alertKey, {
                    //    param: response.headers("X-mrsApp-params")
                    // });
                }
                return response;
            }
        };

        return service;

    }]);

    app.factory("errorHandlerInterceptor", ["$q", "$rootScope", (q: ng.IQService, $rootScope: ng.IRootScopeService) => {

        let service = {
            responseError: (response: ng.IHttpPromiseCallbackArg<any>) => {

                if (!(response.status === 401 && (response.data === "" || (response.data.path && response.data.path
                    .indexOf("/api/account") === 0)))) {
                    $rootScope.$emit("mrsApp.httpError", response);
                }
                return q.reject(response);
            }
        };

        return service;

    }]);

    app.factory("authExpiredInterceptor", ["$q", "$injector", "$localStorage", "$sessionStorage",
        (q: ng.IQService, injector: ng.auto.IInjectorService,
            localStorage: ng.storage.IStorageService, sessionStorage: ng.storage.IStorageService) => {

            let service = {
                responseError: (response: ng.IHttpPromiseCallbackArg<any>) => {
                    if (response.status === 401) {

                        delete localStorage["authenticationToken"];
                        delete sessionStorage["authenticationToken"];

                        let principal = injector.get<IPrincipal>("Principal");

                        if (principal.isAuthenticated()) {
                            let auth = injector.get<IAuth>("Auth");
                            auth.authorize(true);
                        }

                    }

                    return q.reject(response);

                }
            };

            return service;

        }]);

    app.factory("authInterceptor", ["$q", "$localStorage", "$sessionStorage", (q: ng.IQService,
        localStorage: ng.storage.IStorageService, sessionStorage: ng.storage.IStorageService) => {

        let service = {
            request: (config: ng.IRequestConfig) => {
                config.headers = config.headers || {};

                let token = localStorage["authenticationToken"]
                    || sessionStorage["authenticationToken"];

                if (token) {
                    config.headers["Authorization"] = "Bearer " + token;
                }

                return config;
            }
        };

        return service;

    }]);

}