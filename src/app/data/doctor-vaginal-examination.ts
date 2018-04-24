namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDoctorVaginalExamination extends IAggregateRoot<string> {

        vulva: string;
        vagina: string;
        applicationToPresentingPart: string;
        position: string;
        liquor: string;
        cordFelt: string;
        note: string;
        pelvicAssessment: string;
    }


    export interface IDoctorVaginalExaminationService extends data.IAggregateRootService<IDoctorVaginalExamination, string> {
        saveDoctorVaginalExamination(deliveryId: string, entity: IDoctorVaginalExamination): ng.IPromise<IDoctorVaginalExamination>;
    }

    interface IDoctorVaginalExaminationResource extends IResourceService<IDoctorVaginalExamination> {

    }

    class DoctorVaginalExaminationService extends EntityService<IDoctorVaginalExamination, string, IDoctorVaginalExaminationResource> implements IDoctorVaginalExaminationService {

        static $inject = ["DoctorVaginalExaminationResource"];
        constructor(private resource: IDoctorVaginalExaminationResource) {
            super(resource);
        }
        saveDoctorVaginalExamination = (deliveryId: string, entity: IDoctorVaginalExamination): ng.IPromise<IDoctorVaginalExamination> => {
            return this.getResource().save({ deliveryId: deliveryId }, entity).$promise;
        }

    }

    app.factory("DoctorVaginalExaminationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDoctorVaginalExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/doctor-vaginal-examinations/:id;");

            return <IDoctorVaginalExaminationResource>$resource(resourceUrl, {}, {
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
                "update": { method: "PUT" },
                "save": {
                    url: mrs.config.Settings.serverResource("api/doctor-vaginal-examinations/:deliveryId"),
                    method: "POST"
                },
            });

        }]);

    app.service("DoctorVaginalExaminationService", DoctorVaginalExaminationService);

}