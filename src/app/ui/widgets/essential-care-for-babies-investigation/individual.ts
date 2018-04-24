namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IEncounterInvestigationDialog extends ng.IController {
    saved: (personInvestigationId: Object) => void;
    closed: () => void;
  }

  class Controller implements IEncounterInvestigationDialog {
    personInvestigationId: string;
    investigationType: string;
    personId: string;
    encounterId: string;
    investigationId: string;
    workspaceId: string;
    personInvestigation = {} as data.IPersonInvestigation;
    encounterInvestigationId: string;
    investigationResults: Array<data.IResult> = [];

    public saved: (personInvestigationId: Object) => void;
    public closed: () => void;

    static $inject = ["PersonInvestigationService", "SiteSettingService", "$uibModal", "EncounterInvestigationService", "InvestigationResultService"];
    constructor(private personInvestigationService: data.IPersonInvestigationService,
      private siteSettingService: data.ISiteSettingService,
      private modal: ng.ui.bootstrap.IModalService,
      private encounterInvestigationService: data.IEncounterInvestigationService,
      private investigationResultService: data.IInvestigationResultService) {
    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      console.log("onChangesObj", onChangesObj);
      this.init();
    }

    init = () => {

      if (this.personInvestigationId && this.personId && this.encounterId && this.investigationType) {
        this.siteSettingService.fetch(this.investigationType).then((response) => {
          this.investigationId = response.value;
          this.personInvestigationService.get(this.personInvestigationId).then((response) => {
            this.personInvestigation = response;

            this.investigationResultService.getResultByInvestigationId(this.personInvestigation.investigationId).then((response) => {
              this.investigationResults = response;
            });
          }, (err) => {
            console.log("create investigation");
          });
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

    update = () => {
      if (this.personInvestigation.id) {
        this.edit();
      } else {
        this.add();
      }
    }

    editInvestigation = () => {
      let header = "Edit Investigation";

      let body = `
      <mrs-person-investigation-test-list  person-investigation-id="` + this.personInvestigationId + `"
      add-test="vm.add()" edit-test="vm.edit(personInvestigationTestId)" closed="vm.close()"></mrs-person-investigation-test-list>
      `;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.close = function () {
            modalInstance.close();
          };
          this.add = function () {
            modalInstance.dismiss({ route: "add" });
          };
          this.edit = function (id: string) {
            modalInstance.dismiss({ route: "edit", id: id });
          };

        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
      });

      modalInstance.result.then(
        () => {
          this.init();
          this.saved({ personInvestigationId: this.personInvestigationId });
        }, (response) => {
          if (response.route === "add") {
            this.addTest();
          }

          if (response.route === "edit") {
            this.editTest(response.id);
          }

        });
    }

    addTest = () => {
      let header = "Add Investigation Test";

      let body =
        `
        <mrs-person-investigation-test-dialog workspace-id="` + this.workspaceId + `" person-investigation-test-id="-1"
        person-investigation-id="` + this.personInvestigationId + `" closed="vm.close()">
        </mrs-person-investigation-test-dialog>
`      ;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.close = function () {
            modalInstance.close();
          };

        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
      });

      modalInstance.result.then(
        () => {
          this.edit();
        });
    }

    editTest = (id: string) => {
      let header = "Edit Investigation Test";

      let body =
        `
        <mrs-person-investigation-test-dialog person-investigation-test-id="` + id + `"
        person-investigation-id="` + this.personInvestigationId + `" closed="vm.close()">
        </mrs-person-investigation-test-dialog>
`      ;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.close = function () {
            modalInstance.close();
          };

        },
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
      });

      modalInstance.result.then(
        () => {
          this.edit();
        });
    }

    edit = (id?: string) => {
      if (id) {
        this.personInvestigationId = id;
        this.editInvestigation();
        this.init();

      } else {
        this.personInvestigationId = this.personInvestigation.id;
        this.editInvestigation();
      }
    }


    add = () => {
      let header = "Add Investigation";

      let body =
        `
<uib-tabset>
        <uib-tab heading="Recent Investigations" active="true">
           <mrs-encounter-investigation-list section="deliveryNurseExamination" closed="vm.close()" workspace-id="` + this.workspaceId + `" person-id = "` + this.personId + `"  encounter-id ="` + this.encounterId + `" person-investigation-id = "` + this.personInvestigationId + `"
           investigation-id = "` + this.investigationId + `" perform-test="vm.perform(id)"></mrs-encounter-investigation-list>
        </uib-tab>
        <uib-tab heading="New">
            <mrs-encounter-investigation-dialog encounter-id ="` + this.encounterId + `" 
            person-investigation-id = "-1" person-id = "` + this.personId + `" 
            investigation-id = "` + this.investigationId + `" saved = "vm.save(personInvestigationId)" closed = "vm.close()"></mrs-encounter-investigation-dialog>
        </uib-tab>
</uib-tabset>
`      ;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: function () {
          this.perform = function (personInvestigationId: string) {
            modalInstance.dismiss(personInvestigationId);
          };
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
      });

      modalInstance.result.then(
        () => {
          this.closed();
        }, (id) => {
          this.personInvestigationId = id;
          this.editInvestigation();
          this.init();
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

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/essential-care-for-babies-investigation/individual.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personInvestigationId: "<",
        personId: "<",
        encounterId: "<",
        workspaceId: "@",
        investigationType: "@",
        closed: "&",
        saved: "&"

      };

    }


  }

  app.component("mrsEssentialCareBabiesIndividualInvestigationDialog", new Component());

}
