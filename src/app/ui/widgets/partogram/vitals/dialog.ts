namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonPartogramVitalDialog extends ng.IController {
        closed: () => void;
        saved: (personVitalId: Object) => void;
    }

    class Controller implements IPersonPartogramVitalDialog {

        personVital = {} as data.IPersonVital;
        personVitalListElement = {} as data.IEncounterVitalList;
        personVitalList: Array<data.IPersonVital> = [];
        bpId: string;
        datePickerOpenStatus = {};
        personId: string;
        vitalId: string;
        encounterId: string;
        vitalName: string;
        personVitalId: string;
        vital = {} as data.IVital;
        unit: data.IUnit;
        date: string;
        systolic: number;
        diastolic: number;
        message: string;
        personVitalValue: number;
        public closed: () => void;
        public saved: (personVitalId: Object) => void;

        static $inject = ["SiteSettingService", "PersonVitalService", "VitalService", "UnitService", "EncounterVitalService"];
        constructor(
            private siteSettingService: data.ISiteSettingService,
            private personVitalService: data.IPersonVitalService,
            private vitalService: data.IVitalService,
            private unitService: data.IUnitService,
            private encounterVitalService: data.IEncounterVitalService) {
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {


            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;


            });

            if (this.vitalId && this.date) {
                this.vitalService.get(this.vitalId).then((response) => {
                    this.vital = response;
                    this.unitService.get(this.vital.unitId).then((response) => {
                        this.unit = response;
                    });
                });

                this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                });
                this.getBpVitalConfig();

                if (this.personId && this.date) {
                    this.personVitalService.getByPersonIdVitalIdAndDate(this.personId, this.vitalId, this.date).then((response) => {
                        this.personVital = response;

                        console.log(this.personVital);

                        if (response.vitalId === this.bpId) {
                            this.systolic = parseInt(this.personVital.value.split("/")[0]);
                            this.diastolic = parseInt(this.personVital.value.split("/")[1]);
                        }

                    }, (error) => {
                        this.personVital.date = new Date(moment(this.date));
                        this.personVital.personId = this.personId;
                        this.personVital.vitalId = this.vitalId;
                    });

                }
            }

        }

        getBpVitalConfig = () => {
            if (this.personVital.value) {
                this.systolic = parseInt(this.personVital.value.split("/")[0]);
                this.diastolic = parseInt(this.personVital.value.split("/")[1]);

                if (this.vital.name) {
                    // define for systolic

                    if (this.diastolic) {
                        let diastolic = this.diastolic;
                        if (diastolic > this.vital.maximum) {
                            this.message = "diastolic value is above normal";

                        }
                        else if (diastolic < this.vital.minimum) {
                            this.message = "diastolic value is below normal";
                        }
                        return this.message;
                    }
                    else if (this.systolic) {
                        let systolic = this.systolic;
                        if (systolic > this.vital.maximum) {
                            this.message = "systolic value is above normal";
                        }
                        else if (systolic < this.vital.minimum) {
                            this.message = "systolic value is below normal";
                        }
                        return this.message;
                    }
                }
            }



        }


 validateVital = () => {

      this.message = "";


      if (this.vital.id === this.bpId) {
        // call tha splitting method
        this.getBpVitalConfig();

        // do BP validation

      } else {
        let value: number = parseFloat(this.personVital.value);

        if (value < this.vital.minimum) {
          this.message = "Value entered for this patient is below normal range";
        }

        if (value > this.vital.maximum) {
          this.message = "Value entered for this patient is above normal  range";
        }

      }

    }
















        validateVitalBpDiastolic = (): string => {
            let msg = "";

            if (this.vital.name) {
                // define for systolic
                if (this.diastolic) {
                    let diastolic = this.diastolic;
                    if (diastolic > this.vital.maximum) {
                        msg = "The value is above normal";

                    }
                    else if (diastolic < this.vital.minimum) {
                        msg = "The value is below normal";
                    }
                    return msg;
                }
            }

        }

        validateVitalBpSystolic = (): string => {
            let msg = "";

            if (this.vital.name) {
                // define for systolic
                if (this.systolic) {
                    let systolic = this.systolic;
                    if (systolic > this.vital.maximum) {
                        msg = "The value is above normal";
                    }
                    else if (systolic < this.vital.minimum) {
                        msg = "The value is below normal";
                    }
                    return msg;
                }
            }
        }

        saveBp = () => {
            if (this.personVital.id !== "") {
                if ((this.systolic) && (this.diastolic)) {
                    this.personVital.value = (this.systolic) + "/" + (this.diastolic);
                    this.personVitalService.update(this.personVital).then((response) => {
                        console.log(response);
                    });
                }
            }
            else {
                if (this.systolic && this.diastolic) {
                    this.personVital.value = (this.systolic) + "/" + (this.diastolic);
                    this.encounterVitalService.saveEncounterVital(this.encounterId, this.personVital).then((response) => {
                        this.personVital.id = response.personVitalId;
                    });
                }
            }
        }



        save = () => {
            console.log("this.personVital");
            console.log(this.personVital);

            if (this.personVital.id) {
                console.log(this.personVital.value);
                this.personVitalService.update(this.personVital).then((response) => {
                });
            }
            else {

                this.encounterVitalService.saveEncounterVital(this.encounterId, this.personVital).then((response) => {
                    this.personVital.id = response.personVitalId;
                });
            }

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/vitals/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterId: "<",
                personId: "<",
                vitalId: "<",
                date: "<",
            };

        }
    }

    app.component("mrsPartogramVitalDialog", new Component());

}
