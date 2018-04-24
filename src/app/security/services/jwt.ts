namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export const AUTH_EVENT = "authentication-changed";

    export interface ICredential {
        username: string;
        password: string;
        rememberMe: boolean;
    }

    export interface IAuthServerProvider {
        getToken: () => string;
        login: (credentials: ICredential) => ng.IPromise<string>;
        loginWithToken: (jwt: string, rememberMe: boolean) => ng.IPromise<string>;
        storeAuthenticationToken: (jwt: string, rememberMe: boolean) => void;
        logout: () => void;
    }

    class AuthServerProvider implements IAuthServerProvider {

        key = "authenticationToken";

        // static $inject = ["$http", "$localStorage", "$sessionStorage", "$q"];
        constructor(private $http: ng.IHttpService, private $localStorage: ng.storage.IStorageService,
            private $sessionStorage: ng.storage.IStorageService, private $q: ng.IQService) {

        }

        getToken = (): string => {
            return this.$localStorage[this.key] || this.$sessionStorage[this.key];
        }

        login = (credentials: ICredential): ng.IPromise<string> => {

            let userInfo = {
                username: credentials.username,
                password: credentials.password,
                rememberMe: credentials.rememberMe
            };

            this.logout();

            return this.$http.post(mrs.config.Settings.serverResource("api/authenticate"), userInfo)
                .then((response) => {
                    let jwt = response.data["id_token"];
                    this.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }, (e) => {
                    return "Unauthorized";
                });

        }

        loginWithToken = (jwt: string, rememberMe: boolean): ng.IPromise<string> => {
            let deferred = this.$q.defer();

            if (angular.isDefined(jwt)) {
                this.storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        storeAuthenticationToken = (jwt: string, rememberMe: boolean): void => {
            if (rememberMe) {
                this.$localStorage[this.key] = jwt;
            } else {
                this.$sessionStorage[this.key] = jwt;
            }
        }

        logout = (): void => {
            delete this.$localStorage[this.key];
            delete this.$sessionStorage[this.key];
        }

    }

    app.factory("AuthServerProvider", ["$http", "$localStorage", "$sessionStorage", "$q",
        ($http: ng.IHttpService, $localStorage: ng.storage.IStorageService,
            $sessionStorage: ng.storage.IStorageService, $q: ng.IQService): IAuthServerProvider => {

            return new AuthServerProvider($http, $localStorage,
                $sessionStorage, $q);

        }]);

}
