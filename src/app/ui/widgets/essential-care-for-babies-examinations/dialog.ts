namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncouterExaminationDialog extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;

  }

  class Controller implements IEncouterExaminationDialog {

    encounterId: string;
    personId: string;
    examination: data.IExamination;
    personExaminationsList: Array<data.IEssentialBabiesCareExaminationList> = [];
    examinationId: string;
    personExaminationId: string;
    examinationName: string;
    encounterExaminationId: string;
    essentialBabyCareId: string;
    date: string;

    encounterExamination = {} as data.IEncounterExamination;
    personExamination = {} as data.IPersonExamination;
    datePickerOpenStatus = {};

    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["EssentialBabiesCareService", "EncounterExaminationService", "PersonExaminationService", "ExaminationService"
      , "DateUtils", "SiteSettingService", "dialogs"];
    constructor(
      private essentialBabiesCareService: data.IEssentialBabiesCareService,
      private encounterExaminationService: data.IEncounterExaminationService,
      private personExaminationService: data.IPersonExaminationService,
      private examinationService: data.IExaminationService,
      private dateUtils: utils.IDateUtils,
      private siteSettingService: data.ISiteSettingService,
      private dialog: ng.dialogservice.IDialogService) {

    }
    $onInit = (): void => {

      console.log("this.examinationId");
      console.log(this.examinationId);
      // i have examination id 


      this.getExamination(this.examinationId);





      /*     this.encounterExaminationService.get(this.encounterExaminationId).then((response) => {
            this.encounterExamination = response;
    
            this.personExaminationService.get(response.personExaminationId).then((response) => {
              this.personExamination = response;
    
              console.log(response);
              this.getExamination(response.examinationId);
            }); */


      this.essentialBabiesCareService.getessentialBabiesCareExaminations(this.essentialBabyCareId).then((response) => {
        console.log("<<<-------------examinations----response------------------>>>>>>>>>>>>>>>>>>");
        console.log(response);
        this.personExaminationsList = response;



      }, (error) => {

        this.siteSettingService.currentTime().then((response) => {
          this.personExamination = {
            date: this.dateUtils.convertLocalDateTimeFromServer(response.currentTime),
            present: false,
            personId: this.personId,
            examinationId: this.examinationId,
            note: ""
          } as data.IPersonExamination;
        });
        this.getExamination(this.examinationId);
      });
    }

    getExamination(id: string) {
      this.examinationService.get(id).then((response) => {
        this.examination = response;
      });
    }

    close = () => {
      this.closed();
    }


    saveEssentialBabiesCareExamination = (personExaminationId: string) => {

      console.log("=================>>>>>>>>.this.essentialBabyCareId");
      console.log(this.essentialBabyCareId);

      this.essentialBabiesCareService.addEssentialBabiesCareExaminations(this.essentialBabyCareId, personExaminationId).then((response) => {

        console.log(" saving esb response----------------->>");
        console.log(response);

      });
    }


    save = () => {

      if (this.encounterExamination.id) {
        this.personExaminationService.update(this.personExamination).then((response) => {
          this.saved({ id: this.encounterExamination.id });

        }, this.saveError);

      } else {

        this.personExamination.personId = this.personId;
        this.personExamination.date = new Date(this.date);
        this.personExamination.examinationId = this.examinationId;


        this.encounterExaminationService.saveEncounterExamination(this.encounterId, this.personExamination).then((response) => {
          console.log("this.personExamination---------------==================>>>>>>>>>>");
          console.log(response);
          this.saveEssentialBabiesCareExamination(response.personExaminationId);

          this.saved({ id: response.id });
          console.log("create");
        }, this.saveError);

      }
    }

    saveError = () => {
      this.dialog.error("Save Error", "Examination could not be saved at this time, Try again");
    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/essential-care-for-babies-examinations/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        examinationId: "<",
        essentialBabyCareId: "<",
        encounterExaminationId: "<",
        saved: "&",
        closed: "&",
        date: "@"
      };

    }
  }

  app.component("mrsEssentialCareBabiesEncounterExaminationDialog", new Component());

}