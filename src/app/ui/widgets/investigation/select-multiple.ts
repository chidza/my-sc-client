namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IInvestigationSelectMultiple extends ng.IController {

    done: (id: Object) => void;
    saveMultiple: (id: Object) => void;
  }

  class Controller implements IInvestigationSelectMultiple {

    sampleId: string;
    testId: string;
    personId: string;
    samples: Array<data.ISample> = [];
    tests: Array<data.ILabTest> = [];
    investigationId: string = "";
    encounterId: string;
    list: Array<data.IPersonInvestigation> = [];
    selected = {} as data.IPersonInvestigation;
    ids: Array<string> = [];
    hiv: string = mrs.config.Settings.SiteSettings.LAB_TEST_HIV_TEST_ID;
    labHivTestId: string;

    public done: (id: Object) => void;
    public saveMultiple: (id: Object) => void;



    static $inject = ["SampleService", "EncounterInvestigationService", "SiteSettingService"];
    constructor(private sampleService: data.ISampleService,
      private encounterInvestigationService: data.IEncounterInvestigationService,
      private siteSettingService: data.ISiteSettingService
    ) {

    }

    $onInit = () => {
      this.sampleService.query().then((response) => {
        this.samples = response.content;
      });
      this.siteSettingService.fetch(this.hiv).then((response) => {
        this.labHivTestId = response.value;
      });
    }

    sampeTests = () => {
      this.sampleService.sampleTests(this.sampleId).then((response) => {
        this.tests = response;
      });
    }

    getInvestigation = (testId: string) => {
      let found: boolean = false;
      this.sampleService.investigation(this.sampleId, testId).then((response) => {
        this.investigationId = response.id;
        if (this.ids.indexOf(this.investigationId) < 0) {
          this.ids.push(this.investigationId);
        } else {
          this.ids.splice(this.ids.indexOf(this.investigationId), 1);
        }
      }, () => {
        this.investigationId = "";
      });
    }

    onSave = () => {
      let date: Date = new Date();
      this.ids.forEach((id) => {
        let inv = {} as data.IPersonInvestigation;
        inv.investigationId = id;
        inv.date = date;
        inv.personId = this.personId;
        this.list.push(inv);
      });
      this.encounterInvestigationService.saveMultipleEncounterInvestigations(this.encounterId, this.list).then((response) => {
        // creation of multiple investigation id's how to save
        // response[0].personInvestigationId
        this.done({ personInvestigationId: response[0].personInvestigationId, personInvestigationIdArray: response });
       // this.saveMultiple({ personInvestigationId: response });
      });

    }

    onCancel = (id: string) => {
      this.done({ id: id });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/investigation/select-multiple.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        done: "&",
        saveMultiple: "&",
        encounterId: "<",
        personId: "<"
      };

    }
  }

  app.component("mrsInvestigationSelectMultiple", new Component());

}
