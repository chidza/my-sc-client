namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArt extends IAggregateRoot<string> {
        artNumber: string;
        bpId: string;
        centralNervousSystem: string;
        cyanosis: boolean;
        date: Date;
        diagnosisId: string;
        enlargedLymphNode: boolean;
        heightId: string;
        investigationId: string;
        jaundice: boolean;
        mentalStatus: string;
        pallor: boolean;
        personId: string;
        pulseId: string;
        rrId: string;
        temperatureId: string;
        weightId: string;
    }

    export interface IArtNextNumber extends IAggregateRoot<string> {
        date: Date;
        number: string;
    }

    export interface IArtFamilyMember {
        memberName: string;
        memberAge: number;
        artStatus: boolean;
        artNumber: string;
        id: string;
    }



    export interface IArtService extends data.IAggregateRootService<IArt, string> {
        create: (personId: string) => ng.IPromise<IArt>;
        getByPersonId: (personId: string) => ng.IPromise<IArt>;
        getPersonVitalsArtId: (artId: string) => ng.IPromise<Array<IPersonVital>>;
        generate: () => ng.IPromise<IArtNextNumber>;
        getFamilyMembers: (personId: string) => ng.IPromise<Array<IArtFamilyMember>>;
    }

    interface IArtResource extends IResourceService<IArt> {
        create: ng.resource.IResourceMethod<IArt>;
        getByPersonId: ng.resource.IResourceMethod<IArt>;
        getPersonVitalsArtId: ng.resource.IResourceMethod<Array<IPersonVital>>;
        generate: ng.resource.IResourceMethod<IArtNextNumber>;
    }

    class ArtService extends EntityService<IArt, string, IArtResource> implements IArtService {

        static $inject = ["ArtResource", "$q", "RelationService", "PersonService", "PersonArtStatusService"];
        constructor(private resource: IArtResource,
            private q: ng.IQService,
            private relationService: IRelationService,
            private personService: IPersonService,
            private personArtStatus: IPersonArtStatusService) {
            super(resource);
        }

        create = (personId: string): ng.IPromise<IArt> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

        getByPersonId = (personId: string): ng.IPromise<IArt> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

        getPersonVitalsArtId = (artId: string): ng.IPromise<Array<IPersonVital>> => {
            return this.getResource().getPersonVitalsArtId({ artId: artId }).$promise;
        }
        generate = (): ng.IPromise<IArtNextNumber> => {
            return this.getResource().generate().$promise;
        }

        getFamilyMembers = (personId: string): ng.IPromise<Array<IArtFamilyMember>> => {
            let relationships: Array<IRelation> = [];
            let result: Array<IArtFamilyMember> = [];
            let defer = this.q.defer();
            this.relationService.getByPersonId(personId).then((response) => {
                relationships = response;
                if (relationships) {
                    relationships.forEach((relation) => {
                        if (relation.personId === personId) {
                            this.personService.get(relation.memberId).then((member) => {
                                this.getByPersonId(relation.memberId).then((art) => {
                                    if (art.id) {
                                        this.personArtStatus.getFirst(art.id).then((artStatus) => {
                                            let onArt = false;
                                            if (artStatus.id) {
                                                onArt = true;
                                            }
                                            result.push({ id:relation.id,memberName: member.lastname + " " + member.firstname, memberAge: this.personService.age(member), artStatus: onArt, artNumber: art.artNumber });
                                        });
                                    }


                                }, (err) => {
                                    result.push({ id:relation.id,memberName: member.lastname + " " + member.firstname, memberAge: this.personService.age(member), artStatus: false, artNumber: "N/A" });
                                });
                            });
                        }
                    });
                    defer.resolve(result);
                } else {
                    defer.reject();
                }
            });

            return defer.promise;
        }

    }

    app.factory("ArtResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IArtResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/arts/:id");

            return <IArtResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByPersonId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/arts/people/:personId")
                }, "getPersonVitalsArtId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/arts/getPersonVitalsArtId/:artId")
                },
                "generate": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/arts/next-number"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ArtService", ArtService);

}