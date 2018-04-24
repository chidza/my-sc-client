namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IVaginalMonitoringDialog extends ng.IController {
    closed: () => void;
    saved: (vaginalId: Object) => void;
  }

  class Controller implements IVaginalMonitoringDialog {

    vaginalId: string;
    vaginal = {} as data.IVaginalMonitoring;
    deliveryId: string;
    degrees: Array<data.IDegree> = [];
    amniotic: Array<data.IAmnioticFluid> = [];
    datePickerOpenStatus = {};

    public closed: () => void;
    public saved: (vaginalId: Object) => void;

    static $inject = ["VaginalMonitoringService", "DegreeService", "AmnioticFluidService"
      , "dialogs", "DateUtils", "SiteSettingService"];
    constructor(private vaginalService: data.IVaginalMonitoringService,
      private degreeService: data.IDegreeService,
      private amnioticService: data.IAmnioticFluidService,
      private dialog: ng.dialogservice.IDialogService,
      private dateUtils: utils.IDateUtils,
      private siteSettingService: data.ISiteSettingService) {

    }

    $onInit = () => {
      this.degreeService.query().then((response) => {
        this.degrees = response;

      });

      this.amnioticService.query().then((response) => {
        this.amniotic = response;


      });

      this.vaginalService.get(this.vaginalId).then((response) => {
        this.vaginal = response;
      }, (error) => {
        this.vaginal.deliveryId = this.deliveryId;
        this.siteSettingService.currentTime().then((response) => {
          let ct = response.currentTime;
          const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
          this.vaginal.date = new Date(myDate);
          this.vaginal.time = new Date(myDate);
        });
      });
    }

    save = () => {
      if (this.vaginal.id !== "") {


        this.onSave(this.vaginalService.update(this.vaginal));
      }
      else {

        this.vaginal.deliveryId = this.deliveryId;
        this.onSave(this.vaginalService.save(this.vaginal));
      }
    }

    openCalendar = (date: any) => {
      if (date) {
        this.datePickerOpenStatus[date] = true;
      }
    }

    onSave = (promise: ng.IPromise<data.IVaginalMonitoring>) => {
      promise.then((response) => {

        this.vaginal = response;
        if (this.saved != null) {
          this.vaginalService.checkVaginal(response.deliveryId, response.id).then((response) => {
            let status: data.IVaginalStatus = response;
            if (status.amniotic === "DANGER" || status.moulding === "DANGER" || status.caput === "DANGER") {
              let dlg = this.dialog.error("Danger", "Patient in danger, please review and take appropriate action!");

              dlg.closed.then(() => {
                this.saved({ vaginalId: this.vaginal.id });
              });
            } else {
              this.saved({ vaginalId: this.vaginal.id });
            }
          });

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
      public templateUrl = "app/ui/widgets/delivery/vaginal-monitoring/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        vaginalId: "<",
        deliveryId: "<",
        closed: "&",
        saved: "&"
      };

    }
  }

  app.component("mrsVaginalDialog", new Component());

}
