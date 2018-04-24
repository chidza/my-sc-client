namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);
  interface IUrinalysisList extends ng.IController {
    adding: () => void;
    editing: (personInvestigationId: Object) => void;
  }
  class Controller implements IUrinalysisList {
    personId: string;
    start: string;
    end: string;
    investigationResults: data.IResult[] = [];
    ids: string[] = [];
    public adding: () => void;
    public editing: (personInvestigationId: Object) => void;
    urinalysis: Array<data.IInvestigationHistoryList> = [];
    static $inject = ["PersonInvestigationService", "dialogs", "InvestigationResultService", "SiteSettingService"];
    constructor(private personInvestigationService: data.IPersonInvestigationService,
      private dialog: ng.dialogservice.IDialogService,
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
    add = () => {
      this.adding();
    }
    edit = (id: string) => {
      this.editing({ personInvestigationId: id });
    }
    delete = (id: string) => {
      let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");
      dlg.result.then((btn) => {
        this.personInvestigationService.remove(id).then((response) => {
          this.init();
        });
      }, (error) => {
      });
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
      public templateUrl = "app/ui/widgets/urinalysis/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        start: "<",
        end: "<",
        adding: "&",
        editing: "&"
      };
    }
  }
  app.component("mrsUrinalysisList", new Component());
}