namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAuthenticationService {
        activateAccount(key: string): ng.IPromise<IAccount>;
        authorize(force: boolean): ng.IPromise<IAccount>;
        changePassword(newPassword: string): ng.IPromise<string>;
        createAccount(account: IRegistration): ng.IPromise<string>;
        login(credentials: ICredentials): ng.IPromise<IAccount>;
        logout(): void;
        loginWithToken(jwt: string, rememberMe: boolean): ng.IPromise<IToken>;
        resetPasswordFinish(keyAndPassword: IKeyAndPassword): ng.IPromise<string>;
        resetPasswordInit(mail: string): ng.IPromise<string>;
        updateAccount(account: IAccount): ng.IPromise<IAccount>;
    }

    class AuthenticationService implements IAuthenticationService {

        static $inject = ["AccountResource", "PrincipalService", "AuthServerProvider", "$q"];
        constructor(private accountService: IAccountService,
            private Principal: IPrincipalService,
            private AuthServerProvider: IAuthServerProvider,
            private q: ng.IQService) { }

        activateAccount = (response: string): ng.IPromise<IAccount> => {
            let defer = this.q.defer();

            this.accountService.activate(response).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        authorize = (force: boolean): ng.IPromise<IAccount> => {
            let defer = this.q.defer();

            this.Principal.identity(force).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        changePassword = (newPassword: string): ng.IPromise<string> => {
            let defer = this.q.defer();

            this.accountService.changePassword(newPassword).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        createAccount = (account: IRegistration): ng.IPromise<string> => {

            let defer = this.q.defer();

            this.accountService.registerAccount(account).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        login = (credentials: ICredentials): ng.IPromise<IAccount> => {

            let deferred = this.q.defer();

            this.logout();

            this.AuthServerProvider.login(credentials).then((response) => {
                deferred.resolve(this.Principal.identity(true));
            }, (error) => {
                this.logout();
                deferred.reject(error);
            });

            return deferred.promise;
        }

        logout = (): void => {
            this.AuthServerProvider.logout();
            this.Principal.authenticate(null);
        }

        loginWithToken = (jwt: string, rememberMe: boolean): ng.IPromise<IToken> => {
            return this.AuthServerProvider.loginWithToken(jwt, rememberMe);
        }

        resetPasswordFinish = (keyAndPassword: IKeyAndPassword): ng.IPromise<string> => {
            let defer = this.q.defer();

            this.accountService.passwordResetFinish(keyAndPassword).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        resetPasswordInit = (mail: string): ng.IPromise<string> => {
            let defer = this.q.defer();

            this.accountService.passwordResetInit(mail).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        updateAccount = (account: IAccount): ng.IPromise<IAccount> => {
            let defer = this.q.defer();

            this.accountService.saveAccount(account).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

    }


    app.service("AuthenticationService", AuthenticationService);

}