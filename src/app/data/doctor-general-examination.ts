namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDoctorGeneralExamination extends IAggregateRoot<string> {
        cvs: string;
        rs: string;
        abdomen: string;
        lie: string;
        presentation: string;
        engagement: string;
        bloodPressureId: string;
        haemoglobinId: string;
        foetalHeartRateId: string;

    }

    export interface IDoctorGeneralExaminationService extends data.IAggregateRootService<IDoctorGeneralExamination, string> {
    }

    interface IDoctorGeneralExaminationResource extends IResourceService<IDoctorGeneralExamination> {

    }

    class DoctorGeneralExaminationService extends EntityService<IDoctorGeneralExamination, string, IDoctorGeneralExaminationResource> implements IDoctorGeneralExaminationService {

        static $inject = ["DoctorGeneralExaminationResource"];
        constructor(private resource: IDoctorGeneralExaminationResource) {
            super(resource);
        }

    }

    app.factory("DoctorGeneralExaminationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDoctorGeneralExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/doctor-general-examinations/:id");

            return <IDoctorGeneralExaminationResource>$resource(resourceUrl, {}, {
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

    app.service("DoctorGeneralExaminationService", DoctorGeneralExaminationService);

}