namespace mrs {

    "use strict";

    export const appName = "mrs";

    let app = angular.module(mrs.appName, ["ngResource", "datatables",
        "ui.bootstrap", "dialogs.main", "ngCacheBuster",
        "dialogs.default-translations", "ngStorage", "ngCookies",
        "ngSanitize", "datatables.bootstrap", "datatables.select",
        "datatables.buttons", "ui.bootstrap.datetimepicker",
        "ui.router", "ngLoadingSpinner", "highcharts-ng",
        "ng-echarts", "imhere-angular-wizard", "htmlToPdfSave"]);

    app.value("$routerRootComponent", "mrsApp");

    class Config {

        static $inject = ["dialogsProvider", "$translateProvider",
            "$localStorageProvider", "$sessionStorageProvider",
            "$httpProvider", "httpRequestInterceptorCacheBusterProvider"];
        constructor(dialogsProvider: any, translateProvider: any,
            localStorageProvider: ng.storage.IStorageProvider,
            sessionStorageProvider: ng.storage.IStorageProvider,
            httpProvider: ng.IHttpProvider,
            httpRequestInterceptorCacheBusterProvider: any) {

            dialogsProvider.useBackdrop("static");
            dialogsProvider.useEscClose(false);
            dialogsProvider.useCopy(false);
            dialogsProvider.setSize("md");

            // Enable escaping of HTML
            // translateProvider.useSanitizeValueStrategy("escapeParameters");
            translateProvider.useSanitizeValueStrategy("sanitize");

            localStorageProvider.setKeyPrefix("mrs-");
            sessionStorageProvider.setKeyPrefix("mrs-");


            httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

            httpProvider.interceptors.push("errorHandlerInterceptor");
            httpProvider.interceptors.push("authExpiredInterceptor");
            httpProvider.interceptors.push("authInterceptor");
            httpProvider.interceptors.push("notificationInterceptor");
        }
    }

    app.config(Config);

}
