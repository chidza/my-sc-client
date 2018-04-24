namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);
  interface IUrinalysisList extends ng.IController {

  }
  class Controller implements IUrinalysisList {
    personId: string;
    start: string;
    end: string;
    investigationResults: data.IResult[] = [];
    ids: string[] = [];
    urinalysis: Array<data.IInvestigationHistoryList> = [];

    static $inject = ["PersonInvestigationService", "InvestigationResultService", "SiteSettingService"];
    constructor(private personInvestigationService: data.IPersonInvestigationService,
      private investigationResultService: data.IInvestigationResultService,
      private siteSettingService: data.ISiteSettingService) {
    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {
      if (this.personId && this.start) {
        this.personInvestigationService.getUrinalysisList(this.personId, this.start, this.end).then((response) => {
          this.urinalysis = response;
          if (this.urinalysis.length > 0) {
            this.urinalysis.forEach((history) => {
              this.ids.push(history.investigationId);
            });
          }
          if (this.ids.length > 0) {
            this.investigationResultService.getResultByInvestigationIds(this.ids).then((response) => {
              this.investigationResults = response;
            });
          }
        });
      }
    }
    getResult = (id: String): String => {
      let result: String = id;
      if (this.investigationResults.length > 0) {
        this.investigationResults.forEach((r) => {
          if (r.id === id) {
            result = r.name;
          }
        });
      }
      return result;
    }
  }
  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/view-drugs/view-urinalysis.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        start: "<",
        end: "<",

      };
    }
  }
  app.component("mrsUrinalysisViewed", new Component());
}