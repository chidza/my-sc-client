namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPartogram extends IAggregateRoot<string> {
        deliveryId: string,
        date: Date,
        lastname: string,
        firstname: string,
        sex: string,
        birthdate: Date
    }

    export interface IPartogramService {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IPartogram>>;
    }

    interface IPartogramResource extends IResourceService<IPartogram> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IPartogram>>;
    }

    class PartogramService implements IPartogramService {

        static $inject = ["$http", "$q"];
        constructor(private http: ng.IHttpService, private q: ng.IQService) {

        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IPartogram>> => {

            let defer = this.q.defer();

            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 10
                };
            }

            let resourceUrl = mrs.config.Settings.serverResource("api/delivery-partograms");

            this.http.get(resourceUrl, {
                params: { text: text, page: page.page, size: page.size, sort: page.sort }
            }).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;


        }


    }


    app.service("PartogramService", PartogramService);

}