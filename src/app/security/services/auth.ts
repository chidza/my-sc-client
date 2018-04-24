namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILoginService {

    }

    export interface IAuth {
        activateAccount: (key: string, callback: Function) => void;
        authorize: (force: boolean) => void;
        changePassword: (newPassword: string, callback: Function) => void;
        createAccount: (account: IIdentity, callback: Function) => void;
        getPreviousState: () => void;
        login: (credentials: ICredential, callback: Function) => void;
        logout: () => void;
        loginWithToken: (jwt: string, rememberMe: boolean) => void;
        resetPasswordFinish: (keyAndPassword: any, callback: Function) => ng.IPromise<any>;
        resetPasswordInit: (mail: string, callback: Function) => void;
        resetPreviousState: () => void;
        storePreviousState: (previousStateName: string, previousStateParams: any) => void;
        updateAccount: (account: IIdentity, callback: Function) => void;
    }

    class Auth implements IAuth {

        constructor(private $sessionStorage: ng.storage.IStorageService,
            private $q: ng.IQService, private Principal: IPrincipal,
            private AuthServerProvider: IAuthServerProvider, private Account: IAccount,
            private Register: IRegister, private Activate: IActivate, private Password: IPassword,
            private PasswordResetInit: IPasswordResetInit, private PasswordResetFinish: IPasswordResetFinish,
            private rootScope: ng.IRootScopeService) {

        }

        activateAccount = (key: string, callback: Function) => {
            let cb = callback || angular.noop;

            return this.Activate.get(key,
                (response: any) => {
                    return cb(response);
                },
                (err: any) => {
                    return cb(err);
                }).bind(this); // .$promise;
        }

        authorize = (force: boolean) => {
            let authReturn = this.Principal.identity(force).then(() => {
                let isAuthenticated = this.Principal.isAuthenticated();

                if (isAuthenticated) {
                    // user is signed in but not authorized for desired state
                    // $state.go("accessdenied");
                }
                else {
                    // user is not authenticated. stow the state they wanted before you
                    // send them to the login service, so you can return them when you"re done
                    // this.storePreviousState($rootScope.toState.name, $rootScope.toStateParams);

                    // now, send them to the signin state so they can log in
                    // $state.go("accessdenied").then(function () {
                    //    LoginService.open();
                    // });
                }

            });

            return authReturn;


        }

        changePassword = (newPassword: string, callback: Function) => {
            let cb = callback || angular.noop;

            return this.Password.save(newPassword, () => {
                return cb();
            }, (err: any) => {
                return cb(err);
            }).$promise;
        }

        createAccount = (account: IIdentity, callback: Function) => {
            let cb = callback || angular.noop;

            return this.Register.save(account,
                () => {
                    return cb(account);
                },
                (err: any) => {
                    this.logout();
                    return cb(err);
                }).bind(this); // .$promise;
        }

        login = (credentials: ICredential, callback: Function) => {
            let cb = callback || angular.noop;
            let deferred = this.$q.defer();

            this.AuthServerProvider.login(credentials)
                .then((data) => {
                    this.Principal.identity(true).then((account) => {
                        this.rootScope.$broadcast(security.AUTH_EVENT);
                        deferred.resolve(data);
                    });
                    return cb();
                })
                .catch((err) => {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                });



            return deferred.promise;
        }

        loginWithToken = (jwt: string, rememberMe: boolean) => {
            return this.AuthServerProvider.loginWithToken(jwt, rememberMe);
        }

        logout = () => {
            this.AuthServerProvider.logout();
            this.Principal.authenticate(null);
        }

        resetPasswordFinish = (keyAndPassword: any, callback: Function) => {
            let cb = callback || angular.noop;

            return this.PasswordResetFinish.save(keyAndPassword, () => {
                return cb();
            }, (err: any) => {
                return cb(err);
            }).$promise;
        }

        resetPasswordInit = (mail: string, callback: Function) => {
            let cb = callback || angular.noop;

            return this.PasswordResetInit.save(mail, () => {
                return cb();
            }, (err: any) => {
                return cb(err);
            }).$promise;
        }

        updateAccount = (account: IIdentity, callback: Function) => {
            let cb = callback || angular.noop;

            return this.Account.save(account,
                () => {
                    return cb(account);
                },
                (err: any) => {
                    return cb(err);
                });
        }

        getPreviousState = (): string => {
            let previousState = this.$sessionStorage["previousState"];
            return previousState;
        }

        resetPreviousState = (): void => {
            delete this.$sessionStorage["previousState"];
        }

        storePreviousState = (previousStateName: string, previousStateParams: any): void => {
            let previousState = { "name": previousStateName, "params": previousStateParams };
            this.$sessionStorage["previousState"] = previousState;
        }

    }


    app.factory("Auth", ["$sessionStorage", "$q", "Principal",
        "AuthServerProvider", "Account", "Register", "Activate", "Password",
        "PasswordResetInit", "PasswordResetFinish", "$rootScope",
        ($sessionStorage: ng.storage.IStorageService,
            $q: ng.IQService, Principal: IPrincipal,
            AuthServerProvider: IAuthServerProvider, Account: IAccount,
            Register: IRegister, Activate: IActivate, Password: IPassword,
            PasswordResetInit: IPasswordResetInit, PasswordResetFinish: IPasswordResetFinish,
            rootScope: ng.IRootScopeService): IAuth => {

            return new Auth($sessionStorage,
                $q, Principal,
                AuthServerProvider, Account,
                Register, Activate, Password,
                PasswordResetInit, PasswordResetFinish, rootScope);

        }]);

}
