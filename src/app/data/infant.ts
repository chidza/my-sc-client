namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IInfant extends IAggregateRoot<string> {
        apgar1: number;
        apgar5: number;
        breastfed: boolean;
        breathing: boolean;
        conditionAfter5: string;
        crying: boolean;
        deliveryId: string;
        deliveryMethod: string;
        headCircumference: number;
        height: number;
        meconium: boolean;
        outcome: string;
        resuscitation: boolean;
        time: Date;
        date: Date;
        weight: number;
        personId: string;

    }

    export interface IInfantGraph extends IAggregateRoot<string> {
        apgar1: number;
        apgar5: number;
        breastfed: boolean;
        breathing: boolean;
        conditionAfter5: string;
        crying: boolean;
        date: Date;
        deliveryId: string;
        deliveryMethod: string;
        headCircumference: number;
        height: number;
        meconium: boolean;
        outcome: string;
        resuscitation: boolean;
        time: Date;
        weight: number;
        personId: string;
        sex: string;

    }


    export interface IInfantPersonList {
        id: string;
        firstname?: string;
        lastname?: string;
        gender?: string;
        birthWeight?: number;
        modeOfDelivery?: string;
        dateOfBirth?: Date;
        personId?: string;
        outcome?: string;
        diagnosisName?: string;
    }

    export interface IChildrenList {
        id: string;
        gender?: string;
        birthWeight?: number;
        modeOfDelivery?: string;
        dateOfBirth?: Date;
        outcome: string;
    }

    export interface IAncList {
        ancId: string;
        deliveryId?: string;
        lnmp?: Date;
        personId?: string;
        placeOfBirth: string;
        pregnancyOutCome: string;
        birth?: Array<IChildrenList>;
        ancRegistrationDate?: Date;

    }

    export interface IInfantService extends data.IAggregateRootService<IInfant, string> {
        getByDeliveryId(deliveryId: string): ng.IPromise<Array<IInfant>>;
        getByDeliveryIdGraph(deliveryId: string): ng.IPromise<Array<IInfantGraph>>;
        getByChildId(personId: string): ng.IPromise<IInfant>;
        getByPersonId(deliveryId: string): ng.IPromise<Array<IInfantPersonList>>;
        getAncsDeliveryInfanatsByPersonId(personId: string): ng.IPromise<Array<IAncList>>;
    }

    interface IInfantResource extends IResourceService<IInfant> {

        getByDeliveryId: ng.resource.IResourceMethod<Array<IInfant>>;
        getByDeliveryIdGraph: ng.resource.IResourceMethod<Array<IInfantGraph>>;
        fetchChildByPersonId: ng.resource.IResourceMethod<IInfant>;
        getAncsDeliveryInfanatsByPersonId: ng.resource.IResourceMethod<Array<IAncList>>;
    }

    class InfantService extends EntityService<IInfant, string, IInfantResource> implements IInfantService {

        static $inject = ["InfantResource", "$q", "PersonService", "PersonVitalService", "FoetalDeathService",
            "PersonDiagnosisService", "DiagnosisService"];
        constructor(private resource: IInfantResource,
            private q: ng.IQService,
            private personService: data.IPersonService,
            private personVitalService: data.IPersonVitalService,
            private foetalDeathService: data.IFoetalDeathService,
            private personDiagnosisService: data.IPersonDiagnosisService,
            private diagnosisService: data.IDiagnosisService) {
            super(resource);
        }

        getByChildId = (personId: string): ng.IPromise<IInfant> => {
            return this.getResource().fetchChildByPersonId({ personId: personId }).$promise;
        }

        getByDeliveryId = (deliveryId: string): ng.IPromise<Array<IInfant>> => {
            return this.getResource().getByDeliveryId({ deliveryId: deliveryId }).$promise;
        }

        getByDeliveryIdGraph = (deliveryId: string): ng.IPromise<Array<IInfant>> => {
            return this.getResource().getByDeliveryId({ deliveryId: deliveryId }).$promise;
        }

        getAncsDeliveryInfanatsByPersonId = (personId: string): ng.IPromise<Array<IAncList>> => {
            return this.getResource().getAncsDeliveryInfanatsByPersonId({ personId: personId }).$promise;
        }

        getByPersonId = (deliveryId: string): ng.IPromise<Array<IInfantPersonList>> => {

            let defer = this.q.defer();



            this.q.all<IInfant[]>(
                [this.getResource().getByDeliveryId({ deliveryId: deliveryId }).$promise
                ]).then((response) => {
                    let chld = response[0];

                    let result: Array<IInfantPersonList> = [];

                    // code to builde Array
                    chld.forEach((child) => {

                        let entry: IInfantPersonList = {
                            id: child.id,
                            modeOfDelivery: child.deliveryMethod,
                            birthWeight: child.weight,
                            outcome: child.outcome
                        };

                        if (child.outcome === "ALIVE") {
                            this.personService.get(child.personId).then((response) => {
                                entry.firstname = response.firstname;
                                entry.lastname = response.lastname;
                                entry.gender = response.sex;
                                entry.dateOfBirth = response.birthdate;
                                entry.personId = child.personId;
                            });
                        }

                        if (child.outcome === "DEAD") {
                            this.foetalDeathService.getByInfantId(child.id).then((response) => {
                                entry.gender = response.gender;
                                if (response.diagnosisId) {
                                    this.personDiagnosisService.get(response.diagnosisId).then((pd) => {
                                        this.diagnosisService.get(pd.diagnosisId).then((d) => {
                                            entry.diagnosisName = d.name;
                                        });
                                    });
                                }
                            });
                        }

                        result.push(entry);

                    });

                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });


            return defer.promise;
        }

    }

    app.factory("InfantResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IInfantResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/infants/:id");

            return <IInfantResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getAncsDeliveryInfanatsByPersonId": {
                    url: mrs.config.Settings.serverResource("api/infants/ancs/:personId"),
                    method: "GET", isArray: true,
                }, "fetchChildByPersonId": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/infants"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getByDeliveryId": {
                    url: mrs.config.Settings.serverResource("api/infants/delivery/:deliveryId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },

                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.time = DateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:ss"));
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.time = DateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:ss"));
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("InfantService", InfantService);

}