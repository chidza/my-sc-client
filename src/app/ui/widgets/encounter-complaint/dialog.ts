namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterComplaintDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }

  class Controller implements IEncounterComplaintDialog {
    encounterId: string;
    personId: string;
    complaintId: string;

    encounterComplaint = {} as data.IEncounterComplaint;
    personComplaint = {} as data.IPersonComplaint;

    encounterComplaintId: string;

    complaint: data.IComplaint;
    isSaving: boolean;
    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["EncounterComplaintService", "PersonComplaintService",
      "ComplaintService", "SiteSettingService", "DateUtils", "dialogs"];
    constructor(private encounterComplaintService: data.IEncounterComplaintService,
      private personComplaintService: data.IPersonComplaintService,
      private complaintService: data.IComplaintService,
      private siteSettingService: data.ISiteSettingService,
      private dateUtils: utils.IDateUtils,
      private dialog: ng.dialogservice.IDialogService) { }

    $onInit = () => {

      this.encounterComplaintService.get(this.encounterComplaintId).then((response) => {
        this.encounterComplaint = response;

        this.personComplaintService.get(response.personComplaintId).then((response) => {
          this.personComplaint = response;

          this.getComplaint(response.complaintId);

        });

      }, (error) => {

        this.siteSettingService.currentTime().then((response) => {

          this.personComplaint = {
            complaintId: this.complaintId,
            date: this.dateUtils.convertLocalDateTimeFromServer(response.currentTime),
            duration: 0,
            personId: this.personId,
            present: false,
            note: ""
          } as data.IPersonComplaint;

          this.getComplaint(this.complaintId);

        });

      });
    }

    getComplaint = (id: string) => {
      this.complaintService.get(id).then((response) => {
        this.complaint = response;
      });
    }

    close = () => {
      this.closed();
    }

    save = () => {

      this.isSaving = true;
      if (this.encounterComplaint.id) {

        this.personComplaintService.update(this.personComplaint).then((response) => {
          this.saved({ id: this.encounterComplaint.id });
        }, this.saveError);

      } else {

        this.encounterComplaintService.saveEncounterComplaint(this.encounterId, this.personComplaint).then((response) => {
          this.saved({ id: response.id });
        }, this.saveError);

      }
    }

    saveError = () => {
      this.isSaving = false;
      this.dialog.error("Save Error", "Complaint could not be save at this time. Please try again");
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/encounter-complaint/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        complaintId: "<",
        encounterComplaintId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsEncounterComplaintDialog", new Component());

}
