namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEmail extends IAggregateRoot<string> {
        address: String;
        personId: string;
    }

    export interface IEmailService extends data.IAggregateRootService<IEmail, string> {
        getByPersonId: (personId: string) => ng.IPromise<Array<IEmail>>;
    }

    interface IEmailResource extends IResourceService<IEmail> {
        getByPersonId: ng.resource.IResourceArrayMethod<IEmail>;
    }

    class EmailService extends EntityService<IEmail, string, IEmailResource> implements IEmailService {

        static $inject = ["EmailResource"];
        constructor(private resource: IEmailResource) {
            super(resource);
        }


        getByPersonId = (personId: string): ng.IPromise<Array<IEmail>> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

    }

    app.factory("EmailResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEmailResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/emails/:id");

            return <IEmailResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByPersonId": {
                    url: mrs.config.Settings.serverResource("/api/emails/people/:personId"),
                    method: "GET", isArray: true
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "update": { method: "PUT" }
            });

        }]);

    app.service("EmailService", EmailService);

}