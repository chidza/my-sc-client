/*namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterMedication extends IAggregateRoot<string> {
        encounterId: string;
        personMedicationId: string;

    }

    export interface IEncounterMedicationService extends data.IAggregateRootService<IEncounterMedication, string> {
        saveEncounterMedication(encounterId: string, entity: IPersonMedication): ng.IPromise<IEncounterMedication>;


    }

    interface IEncounterMedicationResource extends IResourceService<IEncounterMedication> {

    }

    class EncounterMedicationService extends EntityService<IEncounterMedication, string, IEncounterMedicationResource> implements IEncounterMedicationService {

        static $inject = ["EncounterMedicationResource"];
        constructor(private resource: IEncounterMedicationResource) {
            super(resource);
        }
        saveEncounterMedication = (encounterId: string, entity: IPersonMedication): ng.IPromise<IEncounterMedication> => {
            console.log(entity);
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }
    }

    app.factory("EncounterMedicationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterMedicationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-medications/:id");

            return <IEncounterMedicationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    url: mrs.config.Settings.serverResource("api/encounter-medications/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("EncounterMedicationService", EncounterMedicationService);

}*/