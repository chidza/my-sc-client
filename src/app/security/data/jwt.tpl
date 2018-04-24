namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export const AUTH_EVENT = "authentication-changed";

    export interface IToken {
        id_token: string;
        expires: number;
    }

    export interface ICredentials {
        username: string;
        password: string;
        rememberMe?: boolean;
    }

    interface ITokenResource {
        authorize: (credentials: ICredentials) => void;
    }

    export interface IAuthServerProvider {
        getToken(): string;
        hasValidToken(): boolean;
        login(credentials: ICredentials): ng.IPromise<IToken>;
        loginWithToken(jwt: string, rememberMe: boolean): ng.IPromise<IToken>;
        storeAuthenticationToken(jwt: string, rememberMe: boolean): void;
        logout(): void;
    };

    class AuthServerProvider implements IAuthServerProvider {

        static $inject = ["$http", "$localStorage", "$sessionStorage",
            "$q", "$rootScope"];
        constructor(private $http: ng.IHttpService,
            private $localStorage: ng.storage.IStorageService,
            private $sessionStorage: ng.storage.IStorageService,
            private $q: ng.IQService,
            private $rootScope: ng.IRootScopeService) { }

        getToken = (): string => {
            return this.$localStorage["authenticationToken"]
                || this.$sessionStorage["authenticationToken"];
        }

        hasValidToken = (): boolean => {
            let token = this.getToken();

            if (token != null) {
                return token.length > 0;
            } else {
                return false;
            }
        }

        login = (credentials: ICredentials): ng.IPromise<IToken> => {

            let deferred = this.$q.defer();

            let data = {
                username: credentials.username,
                password: credentials.password,
                rememberMe: true
            };

            this.$http.post<IToken>(mrs.config.Settings.serverResource("api/authenticate"), data)
                .then((response) => {
                    this.storeAuthenticationToken(response.data.id_token,
                        credentials.rememberMe);
                    this.$rootScope.$broadcast(security.AUTH_EVENT);
                    deferred.resolve(response);
                }, () => {
                    this.$rootScope.$broadcast(security.AUTH_EVENT);
                    deferred.reject();
                });

            return deferred.promise;

        }

        loginWithToken = (jwt: string, rememberMe: boolean): ng.IPromise<IToken> => {
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

            rememberMe = true;

            if (rememberMe) {
                this.$localStorage["authenticationToken"] = jwt;
            } else {
                this.$sessionStorage["authenticationToken"] = jwt;
            }
        }

        logout = (): void => {
            delete this.$localStorage["authenticationToken"];
            delete this.$sessionStorage["authenticationToken"];
            this.$rootScope.$broadcast(security.AUTH_EVENT);
        }

    }

    app.factory("AuthServerProvider", ["$http", "$localStorage"
        , "$sessionStorage", "$q", "$rootScope",
        ($http: ng.IHttpService,
            $localStorage: ng.storage.IStorageService,
            $sessionStorage: ng.storage.IStorageService,
            $q: ng.IQService,
            $rootScope: ng.IRootScopeService): IAuthServerProvider => {

            return new AuthServerProvider($http,
                $localStorage,
                $sessionStorage,
                $q, $rootScope);

        }]);

}
