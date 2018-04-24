namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface INurseGeneralExamination extends IAggregateRoot<string> {
        bloodPressureId: string;
        engagement: string;
        foetalHeartRateId: string;
        haemoglobinId: string;
        id: string;
        lie: string;
        oedema: boolean;
        presentation: string;
        pulseId: string;
        temperatureId: string;

    }

    export interface INurseGeneralExaminationService extends data.IAggregateRootService<INurseGeneralExamination, string> {

    }

    interface INurseGeneralExaminationResource extends IResourceService<INurseGeneralExamination> {

    }

    class NurseGeneralExaminationService extends EntityService<INurseGeneralExamination, string, INurseGeneralExaminationResource> implements INurseGeneralExaminationService {

        static $inject = ["NurseGeneralExaminationResource"];
        constructor(private resource: INurseGeneralExaminationResource) {
            super(resource);
        }


    }

    app.factory("NurseGeneralExaminationResource", ["$resource",
        ($resource: ng.resource.IResourceService): INurseGeneralExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/nurse-general-examinations/:id");

            return <INurseGeneralExaminationResource>$resource(resourceUrl, {}, {
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

    app.service("NurseGeneralExaminationService", NurseGeneralExaminationService);

}