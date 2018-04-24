namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterAdmission extends IAggregateRoot<string> {
        admissionId: string;
        encounterId: string;
        wardId: string;
    }

    export interface IEncounterAdmissionService extends data.IAggregateRootService<IEncounterAdmission, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IEncounterAdmission>>;

    }

    interface IEncounterAdmissionResource extends IResourceService<IEncounterAdmission> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IEncounterAdmission>>;
    }

    class EncounterAdmissionService extends EntityService<IEncounterAdmission, string, IEncounterAdmissionResource> implements IEncounterAdmissionService {

        static $inject = ["EncounterAdmissionResource"];
        constructor(private resource: IEncounterAdmissionResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IEncounterAdmission>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("EncounterAdmissionResource", ["$resource",
        ($resource: ng.resource.IResourceService): IEncounterAdmissionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/admission-encounters/:id");

            return <IEncounterAdmissionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": { method: "GET", isArray: false },
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

    app.service("EncounterAdmissionService", EncounterAdmissionService);

}