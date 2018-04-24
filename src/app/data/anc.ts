namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAnc extends IAggregateRoot<string> {
        ancNumber: string;
        date: Date;
        number: string;
        lnmp: Date;
        menstrualCycle: string;
        frequency: number;
        bloodFlow: string;
        outcome: string;
        deliveryId?: any;
        personId: string;
        diagnosisId: string;
        feedingOptionId: string;
        firstBooking: boolean;
    }

    export interface IPastAncHistory extends IAggregateRoot<string> {
        deliveryDate: Date;
        outcome: string;
        personId: string;
    }

    export interface IPastAncHistoryDetails extends IAggregateRoot<string> {
        bloodFlow: string;
        date: string;
        deliveryId: string;
        diagnosisId: string;
        feedingOptionId?: string;
        frequency?: number;
        duration?: number;
        id: string;
        lnmp?: string;
        menstrualCycle?: string;
        number?: string;
        outcome?: string;
        personId?: string;
    }

    export interface IArtNextNumber extends IAggregateRoot<string> {
        date: Date;
        number: string;
    }

    export interface GestationalAge {
        day: number;
        week: number;
    }

    export interface IInformation extends IAggregateRoot<string> {
        edd: Date;
        gestationalAge: GestationalAge;
        gravida: number;
        para: number;
    }

    export interface IAncNextNumber extends IAggregateRoot<string> {
        date: Date;
        number: string;
    }

    export interface IAncService extends data.IAggregateRootService<IAnc, string> {
        current: (personId: string) => ng.IPromise<IAnc>;
        getByPerson: (personId: string) => ng.IPromise<Array<IAnc>>;
        getByDelivery: (deliveryId: string) => ng.IPromise<IAnc>;
        getInformation: (personId: string) => ng.IPromise<IInformation>;
        getStaticAncInformation: (deliveryId: string) => ng.IPromise<IInformation>;
        generate: () => ng.IPromise<IAncNextNumber>;
        savePastAnc: (pastAnc: IPastAncHistory) => ng.IPromise<IPastAncHistoryDetails>;
    }

    interface IAncResource extends IResourceService<IAnc> {
        current: ng.resource.IResourceMethod<IAnc>;
        getByPerson: ng.resource.IResourceArrayMethod<IAnc>;
        getByDelivery: ng.resource.IResourceMethod<IAnc>;
        getInformation: ng.resource.IResourceMethod<IInformation>;
        getStaticAncInformation: ng.resource.IResourceMethod<IInformation>;
        generate: ng.resource.IResourceMethod<IAncNextNumber>;
        savePastAnc: ng.resource.IResourceMethod<IPastAncHistoryDetails>;
    }

    class AncService extends EntityService<IAnc, string, IAncResource> implements IAncService {

        static $inject = ["AncResource"];
        constructor(private resource: IAncResource) {
            super(resource);
        }

        current = (personId: string): ng.IPromise<IAnc> => {
            return this.getResource().current({ personId: personId }).$promise;
        }
        getByPerson = (personId: string): ng.IPromise<Array<IAnc>> => {
            return this.getResource().getByPerson({ personId: personId }).$promise;
        }

        getInformation = (personId: string): ng.IPromise<IInformation> => {
            return this.getResource().getInformation({ personId: personId }).$promise;
        }

        getStaticAncInformation = (deliveryId: string): ng.IPromise<IInformation> => {
            return this.getResource().getStaticAncInformation({ deliveryId: deliveryId }).$promise;
        }

        savePastAnc = (pastAnc: IPastAncHistory): ng.IPromise<IPastAncHistoryDetails> => {
            // return this.getResource().save(entity).$promise;
            return this.getResource().savePastAnc(pastAnc).$promise;
        }

        generate = (): ng.IPromise<IAncNextNumber> => {
            return this.getResource().generate().$promise;
        }

        getByDelivery = (deliveryId: string): ng.IPromise<IAnc> => {
            return this.getResource().getByDelivery({ deliveryId: deliveryId }).$promise;
        }
    }

    app.factory("AncResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IAncResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ancs/:id");

            return <IAncResource>$resource(resourceUrl, {},
                {
                    "query": { method: "GET", isArray: true },
                    "get": {
                        method: "GET",
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                                data.lnmp = DateUtils.convertLocalDateFromServer(data.lnmp);
                            }
                            return data;
                        }
                    },
                    "generate": {
                        method: "GET", isArray: false,
                        url: mrs.config.Settings.serverResource("api/ancs/next-number"),
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            }
                            return data;
                        }
                    },
                    "update": {
                        method: "PUT",
                        transformRequest: function (data) {
                            let copy = angular.copy(data);
                            copy.date = DateUtils.convertLocalDateTimeToServer(copy.date);
                            copy.lnmp = DateUtils.convertLocalDateToServer(copy.lnmp);
                            return angular.toJson(copy);
                        },
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                                data.lnmp = DateUtils.convertLocalDateFromServer(data.lnmp);
                            }
                            return data;
                        }
                    },
                    "save": {
                        method: "POST",
                        transformRequest: function (data) {
                            let copy = angular.copy(data);
                            copy.date = DateUtils.convertLocalDateTimeToServer(copy.date);
                            copy.lnmp = DateUtils.convertLocalDateToServer(copy.lnmp);
                            return angular.toJson(copy);
                        },
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                                data.lnmp = DateUtils.convertLocalDateFromServer(data.lnmp);
                            }
                            return data;
                        }
                    }, "current": {
                        url: mrs.config.Settings.serverResource("api/ancs/people/:personId/current"),
                        method: "GET", isArray: false,
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                                data.lnmp = DateUtils.convertLocalDateFromServer(data.lnmp);
                            }
                            return data;
                        }
                    }, "getByDelivery": {
                        url: mrs.config.Settings.serverResource("api/ancs/deliveries/:deliveryId"),
                        method: "GET", isArray: false,
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                                data.lnmp = DateUtils.convertLocalDateFromServer(data.lnmp);
                            }
                            return data;
                        }
                    }, "getByPerson": {
                        url: mrs.config.Settings.serverResource("api/ancs/people/:personId"),
                        method: "GET", isArray: true
                    }, "getInformation": {
                        url: mrs.config.Settings.serverResource("api/ancs/people/:personId/getInformation"),
                        method: "GET", isArray: false,
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.edd = DateUtils.convertLocalDateTimeFromServer(data.edd);
                            }
                            return data;
                        }

                    }, "getStaticAncInformation": {
                        url: mrs.config.Settings.serverResource("api/ancs/deliveries/:deliveryId/partogram/get-anc-static-information"),
                        method: "GET", isArray: false,
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.edd = DateUtils.convertLocalDateTimeFromServer(data.edd);
                            }
                            return data;
                        }

                    },
                    "savePastAnc": {
                        url: mrs.config.Settings.serverResource("api/ancs/history"),
                        method: "POST",
                        transformRequest: function (data) {
                            let copy = angular.copy(data);
                            copy.deliveryDate = DateUtils.convertLocalDateTimeToServer(copy.deliveryDate);
                            let result = angular.toJson(copy);
                            console.log("positng ...: ", result);
                            return result;
                        },
                        transformResponse: function (data) {
                            if (data) {
                                data = angular.fromJson(data);
                                data.deliveryDate = DateUtils.convertLocalDateTimeFromServer(data.deliveryDate);
                            }
                            return data;
                        }
                    }
                });

        }]);

    app.service("AncService", AncService);

}