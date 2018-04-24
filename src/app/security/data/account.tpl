namespace mrs.security {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAccount extends mrs.data.IEntity {
        login: string;
        firstName: string;
        lastName: string;
        email: string;
        activated: boolean;
        langKey: string;
        authorities: string[];
    }

    export interface IRegistration extends IAccount {
        id: number;
        password: string;
    }

    export interface IKeyAndPassword {
        key: string;
        newPassword: string;
    }

    interface IAccountResource extends mrs.data.IResourceService<IAccount> {
        getAccount(): ng.resource.IResourceMethod<IAccount>;
        saveAccount(account: IAccount): ng.resource.IResourceMethod<IAccount>;
        changePassword(password: string): ng.resource.IResourceMethod<IAccount>;
        finishPasswordReset(info: IKeyAndPassword): ng.resource.IResourceMethod<IAccount>;
        requestPasswordReset(email: string): ng.resource.IResourceMethod<IAccount>;
        activateAccount(key: string): ng.resource.IResourceMethod<IAccount>;
        isAuthenticated(): ng.resource.IResourceMethod<IAccount>;
        registerAccount(account: IRegistration): ng.resource.IResourceMethod<IAccount>;
    }

    export interface IAccountService {
        get(): ng.IPromise<IAccount>;
        activate(key: string): ng.IPromise<IAccount>;
        changePassword(password: string): ng.IPromise<string>;
        registerAccount(account: IRegistration): ng.IPromise<string>;
        passwordResetFinish(keyAndPassword: IKeyAndPassword): ng.IPromise<string>;
        passwordResetInit(mail: string): ng.IPromise<string>;
        saveAccount(account: IAccount): ng.IPromise<IAccount>;
    }

    class AccountService implements IAccountService {

        static $inject = ["$http", "$q"];
        constructor(private http: ng.IHttpService,
            private q: ng.IQService) { }

        get = (): ng.IPromise<IAccount> => {

            let deferred = this.q.defer();

            this.http.get<IAccount>(mrs.config.Settings.serverResource("api/account")).then((account) => {
                deferred.resolve(account.data);
            }, (error) => {
                deferred.reject(error);
            });

            return deferred.promise;

        }

        activate = (key: string): ng.IPromise<IAccount> => {

            let deferred = this.q.defer();

            this.http.get<IAccount>(mrs.config.Settings.serverResource("api/activate")).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });

            return deferred.promise;

        }

        changePassword = (password: string): ng.IPromise<string> => {

            let deferred = this.q.defer();

            this.http.post<string>(mrs.config.Settings.serverResource
                ("api/account/change_password"), { password: password }).then((response) => {
                    deferred.resolve(response.data);
                }, (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        registerAccount = (account: IRegistration): ng.IPromise<string> => {

            let deferred = this.q.defer();

            this.http.post<string>(mrs.config.Settings.serverResource
                ("api/register"), account).then((response) => {
                    deferred.resolve(response.data);
                }, (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        passwordResetFinish = (keyAndPassword: IKeyAndPassword): ng.IPromise<string> => {

            let deferred = this.q.defer();

            this.http.post<string>(mrs.config.Settings.serverResource(
                "api/account/reset_password/finish"), keyAndPassword).then((response) => {
                    deferred.resolve(response.data);
                }, (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        passwordResetInit = (mail: string): ng.IPromise<string> => {

            let deferred = this.q.defer();

            this.http.post<string>(mrs.config.Settings.serverResource(
                "api/account/reset_password/init"), { mail: mail }).then((response) => {
                    deferred.resolve(response.data);
                }, (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        saveAccount = (account: IAccount): ng.IPromise<IAccount> => {
console.log(account);
            let deferred = this.q.defer();

           /* this.http.post<string>(mrs.config.Settings.serverResource("api/account"), account).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });*/
console.log("done..");
            return deferred.promise;

        }

    }

    app.factory("AccountResource", ["$resource",
        ($resource: ng.resource.IResourceService): IAccountResource => {

            let api = "api/people";

            let resource = mrs.config.Settings.serverResource(api + "/:id");

            return <IAccountResource>$resource(resource, {}, {
                "getAccount": {
                    url: mrs.config.Settings.serverResource("api/account"),
                    method: "GET"
                },
                "saveAccount": {
                    url: mrs.config.Settings.serverResource("api/account"),
                    method: "POST"
                },
                "changePassword": {
                    url: mrs.config.Settings.serverResource("api/account/change_password"),
                    method: "POST"
                },
                "finishPasswordReset": {
                    url: mrs.config.Settings.serverResource("api/account/reset_password/finish"),
                    method: "POST"
                },
                "requestPasswordReset": {
                    url: mrs.config.Settings.serverResource("/account/reset_password/init"),
                    method: "POST"
                },
                "activateAccount": {
                    url: mrs.config.Settings.serverResource("api/activate"),
                    method: "GET"
                },
                "isAuthenticated": {
                    url: mrs.config.Settings.serverResource("api/authenticate"),
                    method: "GET"
                },
                "registerAccount": {
                    url: mrs.config.Settings.serverResource("api/register"),
                    method: "POST"
                }

            });

        }]);

    app.service("AccountService", AccountService);

}