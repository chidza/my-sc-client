namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEssentialBabiesCare extends IAggregateRoot<string> {

        id: string;
        personId: string;
        deliveryId: string;

    }

    export interface IEssentialBabiesCareInvestigationList extends IEntity {
        personInvestigationId: string;
        sample: string;
        date: string;
        result?: any;
    }
    export interface IEssentialBabiesCareMedicationList extends IEntity {
        personMedicationId: string;
        drugName: string;
        date: string;
    }

    export interface IEssentialBabiesCareExaminationList extends IEntity {
        date: string;
        examination: string;
        note: string;
        personExaminationId: string;
        value: string;
    }

    export interface IEssentialBabiesCareList extends IEntity {
        personVitalId: string;
        vital: string;
        date: string;
        value: string;
        unit: string;
    }

    export interface IEssentialBabiesCareQuestionareList extends IEntity {
        id: string;
        name: string;
        type: string;
    }

    export interface IEssentialBabiesCareService extends data.IAggregateRootService<IEssentialBabiesCare, string> {
        getessentialBabiesCareVitals(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareList>>;

        getessentialBabiesCareExaminations(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareExaminationList>>;

        getessentialBabiesCareMedications(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareMedicationList>>;

        getessentialBabiesCareInvestigations(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareInvestigationList>>;
        getessentialBabiesCareQuestions(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareList>>;
        getEssentialBabiesByDeliveryId(deliveryId: string): ng.IPromise<Array<IEssentialBabiesCare>>;
        getessentialBabiesCareDangerSigns(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareQuestionareList>>;
        getessentialBabiesCareFeedingOptions(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareQuestionareList>>;

        addEssentialBabiesCareVitals(essentialBabiesCareId: string, personVitalId: string): ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareExaminations(essentialBabiesCareId: string, personExaminationId: string): ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareInvestigations(essentialBabiesCareId: string, personInvestigationId: string): ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareQuestions(essentialBabiesCareId: string, personVitalId: string): ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareMedications(essentialBabiesCareId: string, personMedicationId: string): ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareDangerSigns(essentialBabiesCareId: string, dangerSignId: string): ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareFeedingOptions(essentialBabiesCareId: string, feedingOptionId: string): ng.IPromise<IEssentialBabiesCare>;

        deleteEssentialBabiesCareVitals(essentialBabiesCareId: string, personVitalId: string): ng.IPromise<IEssentialBabiesCare>;
        deleteEssentialBabiesCareExaminations(essentialBabiesCareId: string, personExaminationId: string): ng.IPromise<IEssentialBabiesCare>;
        deleteEssentialBabiesCareInvestigations(essentialBabiesCareId: string, personInvestigationId: string): ng.IPromise<IEssentialBabiesCare>;
        // deleteEssentialBabiesCareQuestions(essentialBabiesCareId: string, personVitalId: string): ng.IPromise<IEssentialBabiesCare>;
        deleteEssentialBabiesCareMedications(essentialBabiesCareId: string, personMedicationId: string): ng.IPromise<IEssentialBabiesCare>;
        //  deleteEssentialBabiesCareDangerSigns(essentialBabiesCareId: string, dangerSignId: string): ng.IPromise<IEssentialBabiesCare>;
        // deleteEssentialBabiesCareFeedingOptions(essentialBabiesCareId: string, feedingOptionId: string): ng.IPromise<IEssentialBabiesCare>;

        createEssentialBabiesCare(entity: IEssentialBabiesCare): ng.IPromise<IEssentialBabiesCare>;

        removeEssentialBabiesCareDangerSigns(essentialBabiesCareId: string, dangerSignId: string): ng.IPromise<IEssentialBabiesCare>;
        removeEssentialBabiesCareFeedingOptions(essentialBabiesCareId: string, feedingOptionId: string): ng.IPromise<IEssentialBabiesCare>;


    }

    interface IEssentialBabiesCareResource extends IResourceService<IEssentialBabiesCare> {
        getessentialBabiesCareVitals: ng.resource.IResourceMethod<Array<IEssentialBabiesCareList>>;
        getessentialBabiesCareExaminations: ng.resource.IResourceMethod<Array<IEssentialBabiesCareExaminationList>>;

        getessentialBabiesCareMedications: ng.resource.IResourceMethod<Array<IEssentialBabiesCareMedicationList>>;

        getessentialBabiesCareInvestigations: ng.resource.IResourceMethod<Array<IEssentialBabiesCareInvestigationList>>;

        getessentialBabiesCareQuestions: ng.resource.IResourceMethod<Array<IEssentialBabiesCareList>>;
        getessentialBabiesCareDangerSigns: ng.resource.IResourceMethod<Array<IEssentialBabiesCareQuestionareList>>;
        getessentialBabiesCareFeedingOptions: ng.resource.IResourceMethod<Array<IEssentialBabiesCareQuestionareList>>;

        getAllEssentialBabiesCareByDeliveryId: ng.resource.IResourceMethod<Array<IEssentialBabiesCare>>;

        addEssentialBabiesCareVitals: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        addEssentialBabiesCareExaminations: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        addEssentialBabiesCareInvestigations: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        addEssentialBabiesCareQuestions: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        addEssentialBabiesCareMedications: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        addEssentialBabiesCareDangerSigns: ng.IPromise<IEssentialBabiesCare>;
        addEssentialBabiesCareFeedingOptions: ng.IPromise<IEssentialBabiesCare>;

        deleteEssentialBabiesCareVitals: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        deleteEssentialBabiesCareExaminations: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        deleteEssentialBabiesCareInvestigations: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        //   deleteEssentialBabiesCareQuestions: ng.resource.IResourceMethod<IEssentialBabiesCare>;
        deleteEssentialBabiesCareMedications: ng.resource.IResourceMethod<IEssentialBabiesCare>;

        createEssentialBabiesCare: ng.resource.IResourceMethod<IEssentialBabiesCare>;

        removeEssentialBabiesCareDangerSigns: ng.IPromise<IEssentialBabiesCare>;
        removeEssentialBabiesCareFeedingOptions: ng.IPromise<IEssentialBabiesCare>;

    }

    class EssentialBabiesCareService extends EntityService<IEssentialBabiesCare, string, IEssentialBabiesCareResource> implements IEssentialBabiesCareService {

        static $inject = ["EssentialBabiesCareResource", "$q", "$http"];
        constructor(private resource: IEssentialBabiesCareResource,
            private q: ng.IQService, private http: ng.IHttpService) {
            super(resource);
        }
        getessentialBabiesCareVitals(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareList>> {
            return this.getResource().getessentialBabiesCareVitals({ id: essentialBabiesCareId }).$promise;
        }
        getessentialBabiesCareExaminations(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareExaminationList>> {
            return this.getResource().getessentialBabiesCareExaminations({ id: essentialBabiesCareId }).$promise;
        }
        getessentialBabiesCareMedications(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareMedicationList>> {
            return this.getResource().getessentialBabiesCareMedications({ id: essentialBabiesCareId }).$promise;
        }
        getessentialBabiesCareInvestigations(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareInvestigationList>> {
            return this.getResource().getessentialBabiesCareInvestigations({ id: essentialBabiesCareId }).$promise;
        }
        getessentialBabiesCareQuestions(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareList>> {
            return this.getResource().getessentialBabiesCareQuestions({ id: essentialBabiesCareId }).$promise;
        }
        getEssentialBabiesByDeliveryId(deliveryId: string): ng.IPromise<Array<IEssentialBabiesCare>> {
            return this.getResource().getAllEssentialBabiesCareByDeliveryId({ deliveryId: deliveryId }).$promise;
        }
        getessentialBabiesCareDangerSigns(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareQuestionareList>> {
            return this.getResource().getessentialBabiesCareDangerSigns({ id: essentialBabiesCareId }).$promise;
        }
        getessentialBabiesCareFeedingOptions(essentialBabiesCareId: string): ng.IPromise<Array<IEssentialBabiesCareQuestionareList>> {
            return this.getResource().getessentialBabiesCareFeedingOptions({ id: essentialBabiesCareId }).$promise;
        }


        createEssentialBabiesCare = (entity: IEssentialBabiesCare): ng.IPromise<IEssentialBabiesCare> => {
            return this.getResource().createEssentialBabiesCare(entity).$promise;
        }




        addEssentialBabiesCareVitals = (id: string, personVitalId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + personVitalId;

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        addEssentialBabiesCareDangerSigns = (id: string, dangerSignId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + dangerSignId + "/danger-signs";

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        addEssentialBabiesCareFeedingOptions = (id: string, feedingOptionId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + feedingOptionId + "/feeding-options";

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        addEssentialBabiesCareExaminations = (essentialBabiesCareId: string, personExaminationId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + essentialBabiesCareId + "/" + personExaminationId + "/examinations";

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        addEssentialBabiesCareInvestigations = (id: string, personInvestigationId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + personInvestigationId + "/investigations";

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        addEssentialBabiesCareQuestions = (id: string, personQuestionId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + personQuestionId;

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        addEssentialBabiesCareMedications = (id: string, personMedicationId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + personMedicationId + "/medications";

            this.http.post(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }


        deleteEssentialBabiesCareVitals = (essentialBabiesCareId: string, personVitalId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + essentialBabiesCareId + "/" + personVitalId + "/remove-vitals";
            console.log("url ====>>> ");
            console.log(url);
            this.http.delete(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        /*    deleteEssentialBabiesCareDangerSigns = (id: string, dangerSignId: string): ng.IPromise<IEssentialBabiesCare> => {
   
               let defer = this.q.defer();
   
               let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + dangerSignId + "/danger-signs";
   
               this.http.post(url, {}).then((response) => {
                   defer.resolve(response.data);
               }, (error) => {
                   defer.reject(error);
               });
   
               return defer.promise;
           } */
        /*     deleteEssentialBabiesCareFeedingOptions = (id: string, feedingOptionId: string): ng.IPromise<IEssentialBabiesCare> => {
    
                let defer = this.q.defer();
    
                let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + feedingOptionId + "/feeding-options";
    
                this.http.post(url, {}).then((response) => {
                    defer.resolve(response.data);
                }, (error) => {
                    defer.reject(error);
                });
    
                return defer.promise;
            } */
        deleteEssentialBabiesCareExaminations = (essentialBabiesCareId: string, personExaminationId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + essentialBabiesCareId + "/" + personExaminationId + "/remove-examinations";

            this.http.delete(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        deleteEssentialBabiesCareInvestigations = (id: string, personInvestigationId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + personInvestigationId + "/remove-investigations";

            this.http.delete(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }

        deleteEssentialBabiesCareMedications = (id: string, personMedicationId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + personMedicationId + "/remove-medications";

            this.http.delete(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        removeEssentialBabiesCareDangerSigns = (id: string, dangerSignId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + dangerSignId + "/remove-danger-signs";

            this.http.delete(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }

        removeEssentialBabiesCareFeedingOptions = (id: string, feedingOptionId: string): ng.IPromise<IEssentialBabiesCare> => {

            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/essential-babies-care/") + id + "/" + feedingOptionId + "/remove-feeding-options";

            this.http.delete(url, {}).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }



    }

    app.factory("EssentialBabiesCareResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEssentialBabiesCareResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/essential-babies-care/:id");

            return <IEssentialBabiesCareResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getessentialBabiesCareFeedingOptions": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/feeding-options")
                },
                "getessentialBabiesCareDangerSigns": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/danger-signs")
                },
                "getessentialBabiesCareVitals": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/vitals")
                },
                "getessentialBabiesCareExaminations": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/examinations")
                },
                "getessentialBabiesCareMedications": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/medications")
                },
                "getessentialBabiesCareInvestigations": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/investigations")
                },
                "getessentialBabiesCareQuestions": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:id/questions")
                },
                "getAllEssentialBabiesCareByDeliveryId": {
                    method: "GET", isArray: true,
                    //  /api/essential-babies-care/{deliveryId}
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:deliveryId")
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "createEssentialBabiesCare": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "addEssentialBabiesCareVitals": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personVitalId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "addEssentialBabiesCareExaminations": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personVitalId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "addEssentialBabiesCareInvestigations": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personVitalId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },

                "addEssentialBabiesCareMedications": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personVitalId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },

                "deleteEssentialBabiesCareMedications": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personMedicationId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "deleteEssentialBabiesCareInvestigations": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personInvestigationId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "deleteEssentialBabiesCareExaminations": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personExaminationId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "deleteEssentialBabiesCareVitals": {
                    url: mrs.config.Settings.serverResource("api/essential-babies-care/:essentialBabiesCareId/:personVitalId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },






            });

        }]);

    app.service("EssentialBabiesCareService", EssentialBabiesCareService);

}