namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAncSession {
        encounterId: string;
    }

    export interface IAncModuleService {
        getCurrentAnc(personId: string): ng.IPromise<IAnc>;
        getAncSession(workareaId: string, personId: string): ng.IPromise<IAncVisit>;
    }

    class AncModuleService implements IAncModuleService {

        ancId: string;
        anc = {} as data.IAnc;
        opdId: string;

        static $inject = ["OpdService", "AncService", "AncVisitService", "$q"];
        constructor(private opdService: IOpdService,
            private ancService: IAncService,
            private ancVisitService: IAncVisitService,
            private q: ng.IQService) {

        }
        getCurrentAnc = (personId: string): ng.IPromise<IAnc> => {
            let defer = this.q.defer();

            this.ancService.current(personId).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        getAncSession = (workareaId: string, personId: string): ng.IPromise<IAncVisit> => {
            let defer = this.q.defer();
            this.opdService.current(personId).then((response) => {
                this.opdId = response.id;
                this.getCurrentAnc(personId).then((response) => {
                    this.ancVisitService.ancSession(this.opdId, workareaId, response.id).then((response) => {
                        defer.resolve(response);

                    }, (error) => {
                        defer.reject(error);
                    });
                });
            });
            return defer.promise;
        }
    }

    app.service("AncModuleService", AncModuleService);

}