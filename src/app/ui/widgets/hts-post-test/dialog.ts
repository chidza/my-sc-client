namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IHtsPostTestDialog extends ng.IController {
    closed: () => void;
    saved: () => void;
  }

  class Controller implements IHtsPostTestDialog {
    encounterId: string;
    personId: string;
    htsId: string;
    hts: data.IHts;
    result: String;
    investigationResult: data.IInvestigation;
    reasonsForNotIssuingResult: Array<data.IReasonForNotIssuingResult> = [];
    personInvestigation: data.IPersonInvestigation;
    positiveId: string;
    negativeId: string;
    indeteminantId: string;

    public saved: () => void;

    public closed: () => void;

    static $inject = ["HtsService", "ReasonForNotIssuingResultService", "PersonInvestigationService", "dialogs", "$uibModal", "SiteSettingService"];
    constructor(private htsService: data.IHtsService,
      private reasonService: data.IReasonForNotIssuingResultService,
      private personInvestigationService: data.IPersonInvestigationService,
      private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService,
      private siteSettingService: data.ISiteSettingService) {

    }

    $onInit = () => {


      this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.POSITIVE_RESULT_ID).then((response) => {
        this.positiveId = response.value;
        this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.NEGATIVE_RESULT_ID).then((response) => {
          this.negativeId = response.value;
          this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.INDETERMINANT_RESULT_ID).then((response) => {
            this.indeteminantId = response.value;
            this.htsService.get(this.htsId).then((response) => {
              this.hts = response;

              if (!this.hts.resultsIssued) {
                this.hts.resultsIssued = false;
              }
              this.personInvestigationService.get(this.hts.investigationId).then((response) => {
                if (response.result === this.negativeId) {
                  this.result = "0";
                }
                if (response.result === this.positiveId) {
                  this.result = "1";
                }
                if (response.result === this.indeteminantId) {
                  this.result = "I";
                }
              });
            });
          });
        });
      });



      this.reasonService.query("").then((response) => {
        this.reasonsForNotIssuingResult = response;
      });


    }



    save = () => {

      if (this.hts.resultsIssued) {
        this.hts.reasonForNotIssuingResultId = null;
      }
      this.htsService.update(this.hts).then((response) => {
        this.saved();
      });
    }

    close = () => {
      this.closed();
    }


    reasonForNotIssuingResults = () => {

      let dlg = this.dialog.notify("Reasons", "Please ensure that you put the reason for not issuing result in the next field");

      dlg.result.then((btn) => {

      }, (error) => {

      });

    }



    modelTemplate = (header: string, body: string, footer: string) => {
      return `<div class="modal-header">           
                  <h4 class="modal-title">` + header + `</h4>
              </div>
              <div class="modal-body">
                <br/>` +
        body +
        ` <br></div>
              <div class="modal-footer">`
        + footer +
        `</div>`;
    }


    onSave = (promise: ng.IPromise<data.IHts>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved();
        }
      }, () => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/hts-post-test/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        htsId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsHtsPostTestDialog", new Component());

}
