namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IRelation extends IAggregateRoot<string> {
        memberId: string;
        personId: string;
        typeId: string;
    }

    export interface IRelationList extends IAggregateRoot<string> {
        memberName: string;
        phones: string;
        typeName: string;
        dateOfBirth: Date;
        memberId: string;
    }

    export interface IRelationService extends data.IAggregateRootService<IRelation, string> {
        getByPersonId: (personId?: string) => ng.IPromise<Array<IRelation>>;
        fetch: (personId: string) => ng.IPromise<Array<IRelationList>>;

    }

    interface IRelationResource extends IResourceService<IRelation> {
        getByPersonId: ng.resource.IResourceMethod<Array<IRelation>>;
        getMembers: ng.resource.IResourceMethod<Array<IPerson>>;
        getMemberPhones: ng.resource.IResourceMethod<Array<any>>;
    }

    class RelationService extends EntityService<IRelation, string, IRelationResource> implements IRelationService {

        static $inject = ["RelationResource", "$q", "RelationShipTypesService"];
        constructor(private resource: IRelationResource,
            private q: ng.IQService,
            private relationshipTypeService: data.IRelationShipTypesService) {
            super(resource);
        }

        getByPersonId = (personId?: string): ng.IPromise<Array<IRelation>> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

        fetch = (personId: string): ng.IPromise<Array<IRelationList>> => {
            let defer = this.q.defer();
            let allPages: IPageRequest = {
                page: 0,
                size: 32000
            };
            this.q.all<IRelation[], IPerson[], IRelationShipTypes[], any[]>(
                [
                    this.getResource().getByPersonId({ personId: personId }).$promise,
                    this.getResource().getMembers({ personId: personId }).$promise,
                    this.relationshipTypeService.query(),
                    this.getResource().getMemberPhones({ personId: personId }).$promise,
                ]).then((response) => {
                    let relations = response[0];
                    let members = response[1];
                    let types = response[2];
                    let phones = response[3];
                    let result: Array<IRelationList> = [];
                    relations.forEach((relation) => {
                        if (relation.personId === personId) {
                            let person = {} as IRelationList;
                            person.id = relation.id;
                            person.phones = "";
                            members.forEach((member) => {
                                if (member.id === relation.memberId) {
                                    person.memberName = member.lastname + " " + member.firstname;
                                    person.dateOfBirth = member.birthdate;
                                    person.memberId = member.id;
                                }
                            });
                            types.forEach((type) => {
                                if (type.id === relation.typeId) {
                                    person.typeName = type.name;
                                }
                            });

                            phones.forEach((phone) => {
                                if (phone.personId === relation.memberId) {
                                    person.phones = person.phones + phone.number + ", ";
                                }
                            });
                            if (person.phones.length > 0) {
                                person.phones = person.phones.substring(0, person.phones.length - 2);
                            }
                            result.push(person);
                        }
                    });
                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });
            return defer.promise;

        }

    }

    app.factory("RelationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IRelationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/relations/:id");

            return <IRelationResource>$resource(resourceUrl, {}, {
                "getByPersonId": {
                    url: mrs.config.Settings.serverResource("api/relations/getRelationsByPersonId/:personId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                }, "getMembers": {
                    url: mrs.config.Settings.serverResource("api/relations/:personId/members"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                }, "getMemberPhones": {
                    url: mrs.config.Settings.serverResource("api/relations/:personId/member/phones"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                },
                "query": { method: "GET", isArray: true },
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

    app.service("RelationService", RelationService);

}