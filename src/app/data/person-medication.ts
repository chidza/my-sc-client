namespace mrs.data {
    "use strict";
    let app = angular.module(mrs.appName);
    export interface IPersonMedication extends IAggregateRoot<string> {
        date: Date;
        time: Date;
        drugNameId: string;
        drugOptionId: string;
        personId: string;
    }
    export interface IPersonZepiList extends ng.resource.IResource<IPersonZepiList> {
        date: string;
        name: string;
        id: string;
        dispenseId: string;
    }


    export interface IOxytocinView
        extends ng.resource.IResource<IOxytocinView> {
        time: string;
        quantity: string;
        strength: string;

    }

    export interface IPersonMedicationService extends data.IAggregateRootService<IPersonMedication, string> {
        getByZepi(personId: string): ng.IPromise<Array<IPersonZepiList>>;
        getByPersonId(personId: string, date?: String): ng.IPromise<Array<IPersonMedicationHistoryList>>;
        query(text?: string): ng.IPromise<Array<IPersonMedication>>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IPersonMedication>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IPersonMedication>>;
        getForOpd(opdId: string): ng.IPromise<Array<IPersonMedication>>;
        getByPersonAndDrugAndDate(personId: string, drugNameId: string, date: string): ng.IPromise<IPersonMedication>;
        getOxytocinGivenInLabour: (deliveryId: string, from: string, to: string) => ng.IPromise<Array<IOxytocinView>>;
        
    }

    interface IPersonMedicationResource extends IResourceService<IPersonMedication> {
        getByPersonId: ng.resource.IResourceArrayMethod<IPersonMedication>;
        getZepiMedications: ng.resource.IResourceArrayMethod<IPersonZepiList>;
        getZepiDrugOptions: ng.resource.IResourceArrayMethod<IDrugOption>;
        getZepiDrugNames: ng.resource.IResourceArrayMethod<IDrugName>;
        getPersonDrugOptions: ng.resource.IResourceArrayMethod<IDrugOption>;
        getPersonDrugNames: ng.resource.IResourceArrayMethod<IDrugName>;
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IPersonMedication>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IPersonMedication>;
        getForOpd: ng.resource.IResourceArrayMethod<IPersonMedication>;
        getByPersonAndDrugAndDate: ng.resource.IResourceMethod<IPersonMedication>;
        getOxytocinGivenInLabour: ng.resource.IResourceArrayMethod<IOxytocinView>;
    }
    class PersonMedicationService extends EntityService<IPersonMedication, string, IPersonMedicationResource> implements IPersonMedicationService {

        static $inject = ["PersonMedicationResource", "ZepiDrugNameService", "DrugSuffixService", "$q"];
        constructor(private resource: IPersonMedicationResource,
            private zepiDrugNameService: IZepiDrugNameService,
            private suffixService: IDrugSuffixService,
            private q: ng.IQService) {
            super(resource);
        }

        getByPersonId = (personId: string, date?: String): ng.IPromise<Array<IPersonMedicationHistoryList>> => {
            let defer = this.q.defer();
            let allPages: IPageRequest = {
                page: 0,
                size: 32000
            };
            this.q.all<IPersonMedication[], IDrugOption[], IDrugSuffix[], IDrugName[]>(
                [
                    this.getResource().getByPersonId({ personId: personId, date: date }).$promise,
                    this.getResource().getPersonDrugOptions({ personId: personId }).$promise,
                    this.suffixService.query("", allPages),
                    this.getResource().getPersonDrugNames({ personId: personId }).$promise,
                ]).then((response) => {
                    let medications = response[0];
                    let options = response[1];
                    let suffices = response[2];
                    let names = response[3];

                    let result: IPersonMedicationHistoryList[] = [];
                    medications.forEach((med) => {
                        let entry = {} as IPersonMedicationHistoryList;
                        entry.personMedicationId = med.id;
                        entry.date = med.date;
                        names.forEach((drug) => {
                            if (med.drugNameId === drug.id) {
                                entry.drugName = drug.alias != null && drug.alias.length > 0 ? drug.alias : drug.name;
                                options.forEach((option) => {
                                    if (med.drugOptionId && option.id === med.drugOptionId) {
                                        suffices.forEach((suffix) => {
                                            if (option.suffixId === suffix.id) {
                                                entry.drugName = entry.drugName + " " + suffix.name;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        result.push(entry);
                    });
                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });
            return defer.promise;
        }

        query = (text?: string): ng.IPromise<Array<IPersonMedication>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByPersonAndDrugAndDate = (personId: string, drugNameId: string, date: string): ng.IPromise<IPersonMedication> => {
            return this.getResource().getByPersonAndDrugAndDate({ personId: personId, drugNameId: drugNameId, date: date }).$promise;
        }

        getByZepi = (personId: string): ng.IPromise<Array<IPersonZepiList>> => {
            return this.getResource().getZepiMedications({ personId: personId }).$promise;
        }

        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IPersonMedication>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IPersonMedication>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IPersonMedication>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }


        getOxytocinGivenInLabour = (deliveryId: string, from: string, to: string): ng.IPromise<Array<IOxytocinView>> => {
            return this.getResource().getOxytocinGivenInLabour({ deliveryId: deliveryId, from: from, to: to }).$promise;
        }
    }

    app.factory("PersonMedicationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IPersonMedicationResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-medications/:id");
            return <IPersonMedicationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByPersonId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-medications")
                }, "getPersonDrugOptions": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/drug-options")
                }, "getPersonDrugNames": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/drug-names")
                }, "getZepiDrugOptions": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/zepi/:personId/drug-options")
                }, "getZepiDrugNames": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/zepi/drug-names")
                },
                "getZepiMedications": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/zepi/:personId/person-medications")
                },

                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-medications/history")
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:personId/person-medications")
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-medications")
                },

                "getOxytocinGivenInLabour": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/oxytocin-given-in-labour"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getByPersonAndDrugAndDate": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-medications/drug-names/:drugNameId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:ss"));

                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }
            });
        }]);
    app.service("PersonMedicationService", PersonMedicationService);
}