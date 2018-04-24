namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonAddressList extends ng.IController {
        editPersonAddress: (addressId: Object) => void;
        addPersonAddress: () => void;
    }

    class Controller implements IPersonAddressList {
        public editPersonAddress: (addressId: Object) => void;
        public addPersonAddress: () => void;
        personId: string;
        districtId: string;
        personAddresses: Array<data.IPersonAddress> = [];
        provinces: Array<data.IProvince> = [];
        districts: Array<data.IDistrict> = [];

        static $inject = ["PersonAddressService", "ProvinceService", "DistrictService", "dialogs"];
        constructor(private PersonAddressService: data.IPersonAddressService,
            private provinceService: data.IProvinceService,
            private districtService: data.IDistrictService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }


        init = () => {
            if (this.personId) {
                this.PersonAddressService.getByPersonId(this.personId).then((response) => {
                    this.personAddresses = response;
                });
            }

        }


        edit = (item: data.IPersonAddress) => {
            this.editPersonAddress({ addressId: item.id });
        }

        remove = (item: data.IPersonAddress) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.PersonAddressService.remove(item.id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addPersonAddress();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-address/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editPersonAddress: "&",
                addPersonAddress: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsPersonAddressList", new Component());

}
