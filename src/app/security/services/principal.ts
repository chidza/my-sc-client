namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPrincipal {
        authenticate: (identity: IIdentity) => void;
        hasAnyAuthority: (authorities: string[]) => boolean;
        hasAuthority: (authority: string) => ng.IPromise<boolean>;
        isAuthenticated: () => boolean;
        isIdentityResolved: () => boolean;
        identity: (force?: any) => ng.IPromise<IIdentity>;
    }

    class Principal implements IPrincipal {

        _identity: IIdentity;
        _authenticated = false;

        static $inject = ["$q", "Account"];
        constructor(private $q: ng.IQService, private Account: IAccount) {

        }

        authenticate = (identity: IIdentity): void => {
            this._identity = identity;
            this._authenticated = identity !== null;
        }

        hasAnyAuthority = (authorities: string[]): boolean => {
            if (!this._authenticated || !this._identity || !this._identity.authorities) {
                return false;
            }

            for (let i = 0; i < authorities.length; i++) {
                if (this._identity.authorities.indexOf(authorities[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        hasAuthority = (authority: string): ng.IPromise<boolean> => {
            if (!this._authenticated) {
                return this.$q.when(false);
            }

            return this.identity().then((_id) => {
                return _id.authorities && _id.authorities.indexOf(authority) !== -1;
            }, function () {
                return false;
            });
        }

        identity = (force?: any): ng.IPromise<IIdentity> => {
            let deferred = this.$q.defer();

            if (force === true) {
                this._identity = undefined;
            }

            // check and see if we have retrieved the identity data from the server.
            // if we have, reuse it by immediately resolving
            if (angular.isDefined(this._identity)) {
                deferred.resolve(this._identity);

                return deferred.promise;
            }

            // retrieve the identity data from the server, update the identity object, and then resolve.
            this.Account.get().$promise
                .then((account: any) => {

                    this._identity = account.data;
                    this._authenticated = true;

                    deferred.resolve(this._identity);
                })
                .catch((e) => {
                    this._identity = null;
                    this._authenticated = false;
                    deferred.resolve(this._identity);
                });

            return deferred.promise;

        }

        isAuthenticated = (): boolean => {
            return this._authenticated;
        }

        isIdentityResolved = (): boolean => {
            return angular.isDefined(this._identity);
        }
    }

    app.factory("Principal", ["$q", "Account",
        ($q: ng.IQService, Account: IAccount): IPrincipal => {

            return new Principal($q, Account);

        }]);

}


