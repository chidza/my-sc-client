namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonAddressDialog extends ng.IController {
        closed: () => void;
        saved: (addressId: Object) => void;
    }

    class Controller implements IPersonAddressDialog {

        addressId: string;
        personId: string;
        provinceId: string;
        districtId: string;
        address = {} as data.IPersonAddress;
        addresses: Array<data.IPersonAddress>;
        towns: Array<data.ITown> = [];
        townsList: Array<data.ITown> = [];
        provinces: Array<data.IProvince> = [];
        districts: Array<data.IDistrict> = [];

        public closed: () => void;
        public saved: (addressId: Object) => void;

        static $inject = ["PersonAddressService", "TownService", "ProvinceService", "DistrictService"];
        constructor(private personAddressService: data.IPersonAddressService,
            private townService: data.ITownService,
            private provinceService: data.IProvinceService,
            private districtService: data.IDistrictService) {

        }

        $onInit = () => {

            this.provinceService.query().then((response) => {
                this.provinces = response;
            });

            this.personAddressService.get(this.addressId).then((response) => {
                this.address = response;

                 this.townService.get(this.address.townId).then((response) => {
                    this.towns = [response];
                }, (error) => {
                    console.log(error);
                });

            }, (error) => {
                console.log(error);
                if ((angular.isDefined(error.status)) && (error.status === 404)) {
                    // not found - initialise variable here
                    this.address.personId = this.personId;


                } else {
                    // serious error!
                }
            });
        }

        refreshDistricts = () => {
            this.districtService.getByProvince(this.provinceId).then((response) => {
                this.districts = response;
            });
        }

        refreshTowns = () => {
            this.townService.getByDistrict(this.districtId).then((response) => {
                this.towns = response;
            });
        }

        save = () => {
            if (this.address.id) {
                console.log(this.address);
                this.onSave(this.personAddressService.update(this.address));
            }
            else {
                this.address.personId = this.personId;
                console.log(this.address);
                this.onSave(this.personAddressService.save(this.address));
            }
        }

        onSave = (promise: ng.IPromise<data.IPersonAddress>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    this.saved({ addressId: response.id });
                }
            }, () => {
                // error!
            });
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = " app/ui/widgets/person-address/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                addressId: "<",
                districtId: "<",
                personId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsPersonAddressDialog", new Component());

}
