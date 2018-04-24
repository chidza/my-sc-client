namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonVitalDialog extends ng.IController {
        closed: () => void;
        saved: (id: Object) => void;
    }

    class Controller implements IPersonVitalDialog {

        personVital = {} as data.IPersonVital;
        datePickerOpenStatus = {};
        personId: string;
        vitalId: string;
        personVitalId: string;
        vital = {} as data.IVital;
        unit = {} as data.IUnit;
        bpId: string;
        systolic: number;
        diastolic: number;
        notification: data.IVitalValidation;
        message: string;
        date: Date;

        public closed: () => void;
        public saved: (id: Object) => void;

        static $inject = ["PersonVitalService", "VitalService", "UnitService", "SiteSettingService", "dialogs"];
        constructor(private personVitalService: data.IPersonVitalService,
            private vitalService: data.IVitalService,
            private unitService: data.IUnitService,
            private siteSettingService: data.ISiteSettingService,
            private dialog: ng.dialogservice.IDialogService) {
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;

            });

            // this.getBpVitalConfig();

            if (this.personVitalId) {

                this.personVitalService.get(this.personVitalId).then((response) => {
                    this.personVital = response;
                    this.personId = response.personId;

                    this.getVitalDetail(response.vitalId);

                }, (error) => {
                    this.dialog.error("Network Error", "Error retriving data. Please check network");
                });

            } else {

                if (this.date) {
                    this.personVital.date = new Date(this.date);
                } else {
                    this.personVital.date = new Date();
                }

                this.personVital.personId = this.personId;
                this.personVital.vitalId = this.vitalId;

                this.getVitalDetail(this.vitalId);

            }


        }

        getVitalDetail = (vitalId: string) => {
            if (vitalId) {
                this.vitalService.get(vitalId).then((response) => {
                    this.vital = response;

                    this.unitService.get(response.unitId).then((response) => {
                        this.unit = response;
                    });
                });
            }
        }

        validateVital = () => {
            let msg = "";
            if (this.vital.id === this.bpId) {
                // call tha splitting method
                msg = this.getBpVitalConfig();
                console.log(this.getBpVitalConfig());
                console.log(msg);

                // do BP validation
                return msg;
            } else {
                let personVital = parseInt(this.personVital.value);
                if (personVital > this.vital.maximum) {
                    msg = "The value is above normal";

                }
                else if (personVital < this.vital.minimum) {
                    msg = "The value is below normal";
                }
                return msg;

            }
        }


        getBpVitalConfig = (): string => {
            let msg = "";
            if (this.personVital.value) {
                this.systolic = Number(this.personVital.value.split("/")[0]);
                this.diastolic = Number(this.personVital.value.split("/")[1]);

                if (this.vital.name) {

                    // define for systolic

                    if (this.diastolic) {
                        let diastolic = this.diastolic;
                        if (diastolic > this.vital.maximum) {
                            msg = "diastolic value is above normal";

                        }
                        else if (diastolic < this.vital.minimum) {
                            msg = "diastolic value is below normal";
                        }
                        return msg;
                    }
                    else if (this.systolic) {
                        let systolic = this.systolic;
                        if (systolic > this.vital.maximum) {
                            msg = "systolic value is above normal";
                        }
                        else if (systolic < this.vital.minimum) {
                            msg = "systolic value is below normal";
                        }
                        return msg;
                    }
                }
            }
        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        close = () => {
            this.closed();
        }

        save = () => {
            if (this.personVital.id) {
                this.onSave(this.personVitalService.update(this.personVital));
            } else {
                this.onSave(this.personVitalService.save(this.personVital));
            }
        }



        onSave = (promise: ng.IPromise<data.IPersonVital>) => {
            promise.then((response) => {
                console.log(response, "response");
                this.validate(response.id);
            }, () => {
                // this.dialog.error("Error", "Vital could not be save at this time. Please try again");
            });
        }
        validate = (personVitalId: string) => {
            console.log(this.personId, "this.personId");
            console.log(personVitalId, "personVitalId");
            this.personVitalService.checkVitalByVitalId(this.personId, personVitalId).then((response) => {
                console.log(response);
                this.notification = response;
                if (this.notification.status === "DANGER") {
                    let dlg = this.dialog.confirm("Vital Alert", " Vital entered is in danger region, Are you sure you entered the value correctly?");
                    dlg.result.then((btn) => {
                        this.saved({ id: personVitalId });
                    });

                } else {
                    this.saved({ id: personVitalId });
                }
            }, (error) => {

            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-vital/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                vitalId: "<",
                personId: "<",
                personVitalId: "<",
                date: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsPersonVitalDialog", new Component());

}
