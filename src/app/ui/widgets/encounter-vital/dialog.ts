namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterVitalDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  class Controller implements IEncounterVitalDialog {
    encounterId: string;
    personVitalId: string;
    encounterVitalId: string;
    personId: string;
    vitalId: string;
    encounterVital = {} as data.IEncounterVital;
    // personVital = {} as data.IPersonVital;
    // vital = {} as data.IVital;
    //unit: data.IUnit;
    //bpId: string;
    //systolic: number;
    //diastolic: number;

    //message: string;

    isSaving: boolean;
    notification: data.IVitalValidation;

    public closed: () => void;
    public saved: (id: Object) => void;

    static $inject = ["EncounterVitalService", "PersonVitalService", "VitalService"
      , "UnitService", "dialogs", "DateUtils", "SiteSettingService"];
    constructor(private encounterVitalService: data.IEncounterVitalService,
      private personVitalService: data.IPersonVitalService,
      private vitalService: data.IVitalService,
      private unitService: data.IUnitService,
      private dialog: ng.dialogservice.IDialogService,
      private dateUtils: utils.IDateUtils,
      private siteSettingService: data.ISiteSettingService,
    ) { }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

      this.encounterVitalService.get(this.encounterVitalId).then((response) => {
        this.encounterVital = response;

        this.personVitalId = response.personVitalId;

      }, (error) => {

        this.encounterVital = {

          encounterId: this.encounterId
        } as data.IEncounterVital;

      });

    }

    close = () => {
      this.closed();
    }

    save = (id: string) => {

      console.log("id =====>>>>");
      console.log(id);
      this.isSaving = true;

      if (this.encounterVital.id) {
        // ignore we save already
        this.saved({ id: this.encounterVital.id });
      } else {

        this.personVitalService.get(id).then((response) => {

          this.encounterVitalService.saveEncounterVital(this.encounterId, response).then((response) => {
            this.saved({ id: response.id, personVitalId: response.personVitalId });
          }, this.saveError);

        }, this.saveError);

      }
    }

    saveError = () => {
      this.isSaving = false;
      this.dialog.error("Save Error", "Vital could not be saved. Try again");
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-vital/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        vitalId: "<",
        encounterVitalId: "<",
        saved: "&",
        closed: "&"
      };

    }

  }

  app.component("mrsEncounterVitalDialog", new Component());

}
