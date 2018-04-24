namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPrincipalService {
        authenticate(identity: IAccount): void;
        hasAnyAuthority(authorities: Array<string>): boolean;
        hasAuthority(authority: string): ng.IPromise<boolean>;
        identity(force: boolean): ng.IPromise<IAccount>;
        isAuthenticated(): boolean;
        isIdentityResolved(): boolean;
        username(): string;
    }

    class PrincipalService implements IPrincipalService {
        _identity: IAccount;

        static $inject = ["$q", "AccountService", "AuthServerProvider", "$rootScope"];
        constructor(private q: ng.IQService,
            private accountService: IAccountService,
            private authServerProvider: IAuthServerProvider,
            private rootScope: ng.IRootScopeService) {
        }

        authenticate = (identity: IAccount): void => {
            this._identity = identity;
        }

        hasAnyAuthority = (authorities: Array<string>): boolean => {

            if (!this.isAuthenticated() || !this._identity || !this._identity.authorities) {
                return true;
            }

            for (let i = 0; i < authorities.length; i++) {
                if (this._identity.authorities.indexOf(authorities[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        hasAuthority = (authority: string): ng.IPromise<boolean> => {
            if (!this.isIdentityResolved()) {
                return this.q.when(false);
            }

            return this.identity(false).then(
                (account) => {
                    return account.authorities
                        && account.authorities.indexOf(authority) !== -1;
                }, () => {
                    return false;
                });
        }

        identity = (force: boolean): ng.IPromise<IAccount> => {
            let deferred = this.q.defer();

            if (force === true) {
                this._identity = undefined;
            }

            // check and see if we have retrieved the identity data from the
            // server.
            // if we have, reuse it by immediately resolving
            if (this.isIdentityResolved()) {
                deferred.resolve(this._identity);
            }

            // retrieve the identity data from the server, update the identity
            // object, and then resolve.
            this.accountService.get().then((response) => {
                this._identity = response;
                deferred.resolve(this._identity);
            }, () => {
                this._identity = null;
                deferred.resolve(this._identity);
            });

            return deferred.promise;

        }

        isAuthenticated = (): boolean => {
            return this.authServerProvider.hasValidToken();
        }

        isIdentityResolved = (): boolean => {
            return angular.isDefined(this._identity) && (this._identity != null);
        }

        username = (): string => {
            if (this.isAuthenticated()) {
                return this.isIdentityResolved() ? this._identity.login : "";
            } else {
                return "";
            }
        }

    }


    app.service("PrincipalService", PrincipalService);

}