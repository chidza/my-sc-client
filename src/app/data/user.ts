namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IUser extends IAggregateRoot<number> {
        activated: boolean;
        authorities: string[];
        email: string;
        firstName: string;
        imageUrl: string;
        langKey: string;
        lastName: string;
        login: string;
        password: string;
    }

    export interface IUserService {
        get(login: string): ng.IPromise<IUser>;
        save(user: IUser): ng.IPromise<IUser>;
        update(user: IUser): ng.IPromise<IUser>;
        remove(login: string): ng.IPromise<IUser>;
        query(text?: string): ng.IPromise<Array<IUser>>;
    }

    interface IUserResource extends IResourceService<IUser> {

    }

    class UserService implements IUserService {

        static $inject = ["UserResource"];
        constructor(private resource: IUserResource) {

        }

        get = (login: string): ng.IPromise<IUser> => {
            return this.resource.get({ login: login }).$promise;
        }

        save = (entity: IUser): ng.IPromise<IUser> => {
            return this.resource.save(entity).$promise;
        }

        update = (entity: IUser): ng.IPromise<IUser> => {
            return this.resource.update(entity).$promise;
        }

        remove = (login: string): ng.IPromise<IUser> => {
            return this.resource.delete({ login: login }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<IUser>> => {
            return this.resource.query({ text: name }).$promise;
        }

    }

    app.factory("UserResource", ["$resource",
        ($resource: ng.resource.IResourceService): IUserResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/users/:login");

            return <IUserResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                "save": { method: "POST" },
                "update": { method: "PUT" },
                "delete": { method: "DELETE" }
            });

        }]);

    app.service("UserService", UserService);

}