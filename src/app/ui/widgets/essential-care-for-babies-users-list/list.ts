namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEssentialBabiesCareList extends ng.IController {
        edit: (id: Object) => void;

    }

    class Controller implements IEssentialBabiesCareList {

        deliveryId: string;
        personId: string;
        date: string;
        endTime: any;
        status: boolean;
        essentialCareBabiesInformationList = {} as Array<data.IEssentialBabiesCare>;
        loggedOnUserId: string;
        userList = {} as Array<data.IUser>;
        currentDate: string;
        public edit: (id: Object) => void;



        static $inject = ["InfantService", "DeliveryService", "EssentialBabiesCareService", "UserService", "Principal", "SiteSettingService"];
        constructor(
            private infantService: data.IInfantService,
            private deliveryService: data.IDeliveryService,
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private userService: data.IUserService,
            private Principal: security.IPrincipal,
            private siteSettingService: data.ISiteSettingService) {


        }



        $onInit = () => {


            this.userService.query().then((response) => {
                this.userList = response;
            });

            this.infantService.getByChildId(this.personId).then((response) => {

                this.essentialBabiesCareService.getEssentialBabiesByDeliveryId(response.deliveryId).then((response) => {

                    this.essentialCareBabiesInformationList = response;
                }, (error) => {
                    console.log(error);
                });

            });

            this.Principal.identity().then((response) => {
                this.userService.get(response.login).then((response) => {
                    this.loggedOnUserId = response.login;

                });

            });
        }

        getUserName = (userId: string): string => {

            let fullName = "";


            this.userList.forEach((survey) => {
                if (survey.login === userId) {
                    // return the name

                    fullName = survey.firstName + " " + survey.lastName;

                }
            });

            return fullName;
        }

        select = (item: data.IEssentialBabiesCare) => {

            this.edit({ id: item.id });
        }






    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/essential-care-for-babies-users-list/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                edit: "&",
                viewed: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsEssentialCareBabiesList", new Component());

}