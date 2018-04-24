namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonId {
        personId: string;
    }
    interface IPharmacyPeople extends ng.IController {

    }

    class Controller implements IPharmacyPeople {

        $router: any;

        personId: string;

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        $routeConfig = [{
            path: "/overview/:personId",
            component: "mrsPharmacyPeopleOverview",
            name: "PharmacyPeopleOverview",
            useAsDefault: true
        }, {
            path: "/demographics/:personId",
            component: "mrsPharmacyPeopleDemographics",
            name: "PharmacyPeopleDemographics"
        }, {
            path: "/demographics/:personId/edit",
            component: "mrsPharmacyPeopleDemographicsEdit",
            name: "PharmacyPeopleDemographicsEdit"
        }, {
            path: "/identification/:personId",
            component: "mrsPharmacyPeopleIdentification",
            name: "PharmacyPeopleIdentification"
        }, {
            path: "/identification/:personId/add",
            component: "mrsPharmacyPeopleIdentificationAdd",
            name: "PharmacyPeopleIdentificationAdd"
        },
        {
            path: "/identification/:personId/edit/:id",
            component: "mrsPharmacyPeopleIdentificationEdit",
            name: "PharmacyPeopleIdentificationEdit"
        }, {
            path: "/contact-detail/:personId",
            component: "mrsPharmacyPeopleContactDetail",
            name: "PharmacyPeopleContactDetail"
        },
        {
            path: "/contact-detail/:personId/add",
            component: "mrsPharmacyPeopleContactDetailAddressAdd",
            name: "PharmacyPeopleContactDetailAddressAdd"
        },
        {
            path: "/contact-detail/:personId/edit/:addressId",
            component: "mrsPharmacyPeopleContactDetailAddressEdit",
            name: "PharmacyPeopleContactDetailAddressEdit"
        },
        {
            path: "/phone-detail/:personId/add",
            component: "mrsPharmacyPeopleContactDetailPhoneAdd",
            name: "PharmacyPeopleContactDetailPhoneAdd"
        },
        {
            path: "/phone-detail/:personId/edit/:phoneId",
            component: "mrsPharmacyPeopleContactDetailPhoneEdit",
            name: "PharmacyPeopleContactDetailPhoneEdit"
        },
        {
            path: "/email-detail/:personId/add",
            component: "mrsPharmacyPeopleContactDetailEmailAdd",
            name: "PharmacyPeopleContactDetailEmailAdd"
        },
        {
            path: "/email-detail/:personId/edit/:emailId",
            component: "mrsPharmacyPeopleContactDetailEmailEdit",
            name: "PharmacyPeopleContactDetailEmailEdit"
        },
        {
            path: "/relations/:personId",
            component: "mrsPharmacyPeopleRelation",
            name: "PharmacyPeopleRelation"
        }, {
            path: "/relations/:personId/select",
            component: "mrsPharmacyPeopleRelationSelect",
            name: "PharmacyPeopleRelationSelect"
        }, {
            path: "/relations/:personId/add/:id",
            component: "mrsPharmacyPeopleRelationAdd",
            name: "PharmacyPeopleRelationAdd"
        }, {
            path: "/relations/:personId/edit/:id",
            component: "mrsPharmacyPeopleRelationEdit",
            name: "PharmacyPeopleRelationEdit"
        }, {
            path: "/medical-aid/:personId",
            component: "mrsPharmacyPeopleMedicalAid",
            name: "PharmacyPeopleMedicalAid"
        }, {
            path: "/medical-aid/:personId/add",
            component: "mrsPharmacyPeopleMedicalAidAdd",
            name: "PharmacyPeopleMedicalAidAdd"
        }, {
            path: "/medical-aid/:personId/edit/:id",
            component: "mrsPharmacyPeopleMedicalAidEdit",
            name: "PharmacyPeopleMedicalAidEdit"
        }];

        constructor(
            public templateUrl = "app/ui/workspace/pharmacy/person/person.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<"
            };
        }
    }

    app.component("mrsPharmacyPeople", new Component());

}
