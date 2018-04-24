namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFormulation extends IAggregateRoot<string> {
        name: string;
        standardId: string;
    }

    export interface IFormulationService extends data.IAggregateRootService<IFormulation, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<Array<IFormulation>>;
    }

    interface IFormulationResource extends IResourceService<IFormulation> {

    }

    class FormulationService extends EntityService<IFormulation, string, IFormulationResource> implements IFormulationService {

        static $inject = ["FormulationResource"];
        constructor(private resource: IFormulationResource) {
            super(resource);
        }


        query = (text?: string, page?: IPageRequest): ng.IPromise<Array<IFormulation>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().query({
                text: text, page: page.page, size: page.size, sort: page.sort
            }).$promise;

        }
    }

    app.factory("FormulationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IFormulationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/formulations/:id");

            return <IFormulationResource>$resource(resourceUrl, {}, {
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

    app.service("FormulationService", FormulationService);

}