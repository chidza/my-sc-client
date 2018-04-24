namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPerson extends IAggregateRoot<string> {
        birthdate: Date;
        educationLevelId: string;
        firstname: string;
        id: string;
        istimateAge: boolean;
        lastname: string;
        maritalStateId: string;
        occupationId: string;
        sex: string;
    }
    export interface IHivStatus extends IAggregateRoot<string> {
        date: Date;
        personId: string;
        status: string;

    }

    /*/api/people/{id}/hiv-status*/
    export interface IPersonService extends data.IAggregateRootService<IPerson, string> {
        age: (person: IPerson) => number;
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IPerson>>;
        queryByIdentifier: (personId: IPersonId) => ng.IPromise<Array<IPerson>>;
        hivStatus: (personId: string, date: Date) => ng.IPromise<IHivStatus>;
    }
    export interface IBirthDate {
        day: number;
        month: number;
        year: number;
    }
    interface IPersonResource extends IResourceService<IPerson> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IPerson>>;
        hivStatus: ng.resource.IResourceMethod<IHivStatus>;
        queryByIdentifier: ng.resource.IResourceMethod<Array<IPerson>>;
    }

    class PersonService extends EntityService<IPerson, string, IPersonResource> implements IPersonService {



        static $inject = ["PersonResource", "DateUtils"];
        constructor(private resource: IPersonResource,
            private dateUtils: utils.IDateUtils) {
            super(resource);
        }

        queryByIdentifier = (personId: IPersonId): ng.IPromise<Array<IPerson>> => {
            return this.getResource().queryByIdentifier({ typeId: personId.typeId, number: personId.number }).$promise;
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IPerson>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }
        hivStatus = (personId: string, date: Date): ng.IPromise<IHivStatus> => {
            return this.getResource().hivStatus({ personId: personId, date: this.dateUtils.convertLocalDateTimeToServer(date) }).$promise;
        }

        age = (person: IPerson): number => {
            let age = 0;

            if (person != null) {
                if (person.birthdate) {
                    let date = new Date();

                    return (date.getFullYear() - person.birthdate.getFullYear());

                }
            }

            return age;
        }

    }

    app.factory("PersonResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/people/:id");

            return <IPersonResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": { method: "GET", isArray: false },
                "queryByIdentifier": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/person-ids/people"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "hivStatus": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/hiv-status"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.birthdate = dateUtils.convertLocalDateFromServer(data.birthdate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("PersonService", PersonService);

}