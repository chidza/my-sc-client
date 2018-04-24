namespace mrs.utils {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDatePart {
        date: Date;
        time: string;
    }

    export interface IDateUtils {
        convertDateTimeFromServer(date: Date): Date;
        convertLocalDateFromServer(date: string): Date;
        convertLocalDateToServer(date: Date): string;
        dateformat(): string;
        splitDate(date: Date): Array<string>;
        combineDate(date: string, time: string): string;
        convertLocalDateTimeFromServer(date: string): Date;
        convertLocalDateTimeToServer(date: Date): string;
        convertToLocalDateTimeFormat(date: string): string;
    }

    app.factory("DateUtils", ["$filter",
        ($filter: ng.IFilterService): IDateUtils => {

            return {
                convertDateTimeFromServer: (date: Date): Date => {
                    if (date) {
                        return new Date(date);
                    } else {
                        return null;
                    }
                }, convertLocalDateFromServer: (date: string): Date => {
                    if (date) {
                        let dateString: string[] = date.split("-");
                        return new Date(parseInt(dateString[0]), parseInt(dateString[1]) - 1, parseInt(dateString[2]));
                    }
                    return null;
                }, convertLocalDateToServer: (date: Date): string => {
                    if (date) {
                        return $filter("date")(date, "yyyy-MM-dd");
                    } else {
                        return null;
                    }
                }, dateformat: (): string => {
                    return "yyyy-MM-dd";
                }
                , splitDate: (date: Date): Array<string> => {

                    return [moment(date).format("YYYY-MM-DD"), moment(date).format("HH:mm:ss")];


                }
                , combineDate: (date: string, time: string): string => {
                    return moment(date + " " + time).format("YYYY-MM-DDTHH:mm:ss");

                }, convertLocalDateTimeFromServer: (date: string): Date => {
                    return new Date(moment(date, "YYYY-MM-DDTHH:mm:ss"));

                }, convertLocalDateTimeToServer: (date: Date): string => {
                    return moment(date).format("YYYY-MM-DDTHH:mm:00");
                }, convertToLocalDateTimeFormat: (date: string): string => {
                    return moment(new Date(moment(date, "YYYY-MM-DDTHH:mm:ss"))).format("YYYY-MM-DD HH:mm");
                }
            };

        }]);

    app.directive("autofocus", ["$timeout", ($timeout) => {
        return {
            restrict: "A",
            link: function ($scope, $element) {
                $timeout(() => {
                    $element[0].focus();
                });
            }
        };
    }]);

    interface ISpinnerScope extends ng.IScope {
        isLoading: () => boolean;
    }

    app.directive("usSpinner", ["$http", "$rootScope", ($http, $rootScope) => {
        return {
            link: function (scope: ISpinnerScope, elm, attrs) {
                $rootScope.spinnerActive = false;

                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (loading) {
                    $rootScope.spinnerActive = loading;

                    if (loading) {
                        elm.removeClass("ng-hide");
                    } else {
                        elm.addClass("ng-hide");
                    }
                });
            }
        };

    }]);

}