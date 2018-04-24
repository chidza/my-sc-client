namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVaginalList extends ng.IController {
        editVaginal: (vaginalId: Object) => void;
        addVaginal: () => void;
    }

    class Controller implements IVaginalList {
        public editVaginal: (vaginalId: Object) => void;
        public addVaginal: () => void;
        deliveryId: string;
        degrees: Array<data.IDegree> = [];
        amniotic: Array<data.IAmnioticFluid> = [];
        monitoring: Array<data.IVaginalMonitoring> = [];
        bloodStainedId: string;
        meconiumStainedId: string;
        static $inject = ["VaginalMonitoringService", "dialogs", "DegreeService", "AmnioticFluidService", "SiteSettingService"];
        constructor(private vaginalMonitoringService: data.IVaginalMonitoringService,
            private dialog: ng.dialogservice.IDialogService,
            private degreeService: data.IDegreeService,
            private amnioticService: data.IAmnioticFluidService,
            private siteSettingService: data.ISiteSettingService) {

        }

        $onInit = () => {

            if (this.deliveryId) {
                this.vaginalMonitoringService.fetch(this.deliveryId).then((response) => {
                    this.monitoring = response;
                });
            }
            this.degreeService.query().then((response) => {
                this.degrees = response;
            });
            this.amnioticService.query().then((response) => {
                this.amniotic = response;
            });

            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.AMNIOTIC_FLUID_BLOOD_STAINED).then((response) => {
                this.bloodStainedId = response.value;
            });

            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.AMNIOTIC_FLUID_MECONIUM_STAINED).then((response) => {
                this.meconiumStainedId = response.value;
            });
        }

        getDegree = (id: string) => {
            let result: string;
            if (this.degrees) {
                this.degrees.forEach((degree) => {
                    if (degree.id === id) {
                        result = degree.name;
                    }
                });
            }

            return result;
        }

        getAmniotic = (id: string) => {
            let result: string;
            if (this.amniotic) {
                this.amniotic.forEach((a) => {
                    if (a.id === id) {
                        result = a.name;
                    }
                });
            }

            return result;
        }

        edit = (item: data.IVaginalMonitoring) => {
            this.editVaginal({ vaginalId: item.id });
        }

        remove = (item: data.IVaginalMonitoring) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.vaginalMonitoringService.remove(item.id).then((response) => {
                    this.monitoring.splice(this.monitoring.indexOf(item), 1);
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addVaginal();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/vaginal-monitoring/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editVaginal: "&",
                addVaginal: "&",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsVaginalList", new Component());

}
