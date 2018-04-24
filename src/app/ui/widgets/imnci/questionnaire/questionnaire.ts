namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IImnciQuestionnaireDialog extends ng.IController {

  }

  class Controller implements IImnciQuestionnaireDialog {
    imnciVisitId: string;
    categoryId: string;
    personId: string;
    encounterId: string;
    categoryQuestions: Array<data.IImnciQuestionnaire> = [];
    visitQuestions: Array<data.IImnciVisitQuestion> = [];
    skinPinchList: string[] = ["Immediately", "Slowly", "Very Slowly"];
    muacQuestion: string;
    rdtQuestion: string;
    tempQuestion: string;
    weightQuestion: string;
    heightQuestion: string;
    rdt: string = mrs.config.Settings.SiteSettings.INVESTIGATION_MALARIA_ID;
    muac: string = mrs.config.Settings.SiteSettings.MUAC_ID;
    height: string = mrs.config.Settings.SiteSettings.HEIGHT_ID;
    weight: string = mrs.config.Settings.SiteSettings.WEIGHT_ID;
    temp: string = mrs.config.Settings.SiteSettings.TEMPERATURE_ID;
    diagnosis: data.IDiagnosis;
    classification = {} as data.IImnciVisitCategoryClassification;

    static $inject = ["ImnciQuestionnaireService", "ImnciVisitQuestionService", "ImnciVisitService",
      "SiteSettingService", "$q", "ImnciVisitCategoryClassificationService", "EncounterDiagnosisService",
      "PersonDiagnosisService", "DiagnosisService", "$uibModal"];
    constructor(private imnciQuestionnaireService: data.IImnciQuestionnaireService,
      private imnciVisitQuestionService: data.IImnciVisitQuestionService,
      private imnciVisitService: data.IImnciVisitService,
      private siteSettingService: data.ISiteSettingService,
      private q: ng.IQService,
      private categoryClassificationService: data.IImnciVisitCategoryClassificationService,
      private encounterDiagnosisService: data.IEncounterDiagnosisService,
      private personDiagnosisService: data.IPersonDiagnosisService,
      private diagnosisService: data.IDiagnosisService,
      private modal: ng.ui.bootstrap.IModalService) {

    }


    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();

    }

    $onInit = () => {
      this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.IMNCI_MUAC_QUESTION_ID).then((response) => {
        this.muacQuestion = response.value;
      });
      this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.IMNCI_TEMP_QUESTION_ID).then((response) => {
        this.tempQuestion = response.value;
      });
      this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.IMNCI_WEIGHT_QUESTION_ID).then((response) => {
        this.weightQuestion = response.value;
      });
      this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.IMNCI_HEIGHT_QUESTION_ID).then((response) => {
        this.heightQuestion = response.value;
      });
      this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.IMNCI_RDT_QUESTION_ID).then((response) => {
        this.rdtQuestion = response.value;
      });
    }

    init = () => {
      this.visitQuestions = [];
      if (this.imnciVisitId && this.categoryId) {
        this.imnciVisitService.get(this.imnciVisitId).then((response) => {
          this.encounterId = response.encounterId;
        });
        this.initClassification();
        this.imnciVisitQuestionService.getByImnciVisitId(this.imnciVisitId).then((visitQuestions) => {
          this.imnciQuestionnaireService.getByCategoryId(this.categoryId).then((categoryQuestions) => {
            this.categoryQuestions = categoryQuestions;
            categoryQuestions.forEach((question) => {
              let result = {} as data.IImnciVisitQuestion;
              result.questionId = question.id;
              result.inputType = question.inputType;
              result.imnciVisitId = this.imnciVisitId;
              if (visitQuestions.length > 0) {
                visitQuestions.forEach((vq) => {
                  if (vq.questionId === question.id) {
                    result.id = vq.id;
                    result.value = vq.value;
                  }
                });
              }
              this.visitQuestions.push(result);
            });

          });
        });
      }
    }

    getVitalType = (id: string): string => {
      let result: string;
      if (id === this.muacQuestion) {
        result = this.muac;
      }
      if (id === this.tempQuestion) {
        result = this.temp;
      }
      if (id === this.weightQuestion) {
        result = this.weight;
      }
      if (id === this.heightQuestion) {
        result = this.height;
      }

      return result;
    }
    getInvestigationType = (id: string): string => {
      let result: string;
      if (id === this.rdtQuestion) {
        result = this.rdt;
      }
      return result;
    }




    getName = (id: string): string => {
      let result: string;
      if (this.categoryQuestions) {
        this.categoryQuestions.forEach((question) => {
          if (question.id === id) {
            result = question.name;
          }
        });
      }
      return result;
    }

    updateInvestigation = (id: string, question: data.IImnciVisitQuestion) => {
      question.value = String(id);
      this.save(question);
    }

    updateVital = (id: string, question: data.IImnciVisitQuestion) => {
      question.value = String(id);
      this.save(question);
    }

    save = (question: data.IImnciVisitQuestion) => {
      if (question.id) {
        this.imnciVisitQuestionService.update(question).then((response) => {

        });

      } else {
        this.imnciVisitQuestionService.save(question).then((response) => {
          this.visitQuestions.forEach((qs) => {
            if (qs.questionId === question.questionId) {
              qs.id = response.id;
              qs.value = response.value;
            }
          });
        });
      }

    }

    selectDiagnosis = () => {

      let header = "Select Diagnosis";

      let body = `<mrs-diagnosis-select select-diagnosis= "vm.select(id)"></mrs-diagnosis-select>`;


      let footer = `<button class="btn btn-danger" ng-click="vm.close()">Close</button>`;


      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.close = function () {
            modalInstance.close();
          };

          this.select = function (id: string) {
            modalInstance.dismiss(id);
          };
        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static"
      });

      modalInstance.result.then(
        () => {
          // ignore
        },
        (id) => {
          if (angular.isNumber(id)) {
            this.addDiagnosisDialog(this.personId, this.encounterId, id);
          }
        }
      );

    }


    addDiagnosisDialog = (personId: string, encounterId: string, id: number) => {

      let header = "Add Diagnosis";

      let body = `<mrs-encounter-diagnosis-dialog person-diagnosis-id="-1" 
          encounter-id="$resolve.encounterId" person-id="$resolve.personId" 
          diagnosis-id="$resolve.diagnosisId" saved="vm.save(encounterDiagnosisId)" closed="vm.close()">
          </mrs-encounter-diagnosis-dialog>`;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.close = function () {
            modalInstance.close();
          };
          this.save = function (id: string) {
            modalInstance.dismiss(id);
          };
        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
        resolve: {
          encounterId: +encounterId,
          personId: +personId,
          diagnosisId: +id
        }
      });


      modalInstance.result.then(
        () => {
        }, (id) => {
          this.classification.encounterDiagnosisId = id;
          if (this.classification.id) {
            this.categoryClassificationService.update(this.classification).then((response) => {
              this.initClassification();
            });
          } else {
            this.categoryClassificationService.save(this.classification).then((response) => {
              this.initClassification();
            });
          }


        });
    }


    initClassification = () => {
      this.categoryClassificationService.getByCategoryIdAndImnciVisitId(this.categoryId, this.imnciVisitId).then((response) => {
        this.classification = response;
        this.encounterDiagnosisService.get(response.encounterDiagnosisId).then((response) => {
          this.personDiagnosisService.get(response.personDiagnosisId).then((response) => {
            this.diagnosisService.get(response.diagnosisId).then((response) => {
              this.diagnosis = response;
            });
          });
        });
      }, (err) => {
        this.classification.categoryId = this.categoryId;
        this.classification.imnciVisitId = this.imnciVisitId;
      });
    }

    modelTemplate = (header: string, body: string, footer: string) => {
      return `<div class="modal-header">           
                  <h4 class="modal-title">` + header + `</h4>
              </div>
              <div class="modal-body">
                <br/>` +
        body +
        `</div>
              <div class="modal-footer">`
        + footer +
        `</div>`;
    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/imnci/questionnaire/questionnaire.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        imnciVisitId: "<",
        categoryId: "<",
        personId: "<",
        encounterId: "<"
      };

    }
  }

  app.component("mrsImnciQuestionnaireDialog", new Component());

}