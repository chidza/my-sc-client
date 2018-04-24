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
      console.log("hereeeeeeeeee", onChangesObj);
      this.init();
    }

    init = () => {
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

      let callback = this;

      let header = "Edit Investigation";

      let body = `
      <mrs-person-investigation-test-list  person-investigation-id="vm.data.personInvestigationId"
      add-test="vm.add()" edit-test="vm.edit(personInvestigationTestId)" closed="vm.close()"></mrs-person-investigation-test-list>
      `;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {

          this.data = data;

          this.close = function () {
            modalInstance.close();
          };
          this.add = function () {
            modalInstance.dismiss({ route: "add" });
          };
          this.edit = function (id: string) {
            modalInstance.dismiss({ route: "edit", id: id });
          };

        }],
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
        resolve: {
          data: {
            personInvestigationId: callback.personInvestigationId
          }
        }
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

      let callback = this;

      let header = "Add Investigation Test";

      let body =
        `
        <mrs-person-investigation-test-dialog workspace-id="vm.data.workspaceId" person-investigation-test-id="-1"
        person-investigation-id="vm.data.personInvestigationId" closed="vm.close()">
        </mrs-person-investigation-test-dialog>
`      ;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {

          this.data = data;

          this.close = function () {
            modalInstance.close();
          };

        }],
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
        resolve: {
          data: {
            workspaceId: callback.workspaceId,
            personInvestigationId: callback.personInvestigationId
          }
        }
      });

      modalInstance.result.then(
        () => {
          this.edit();
        });
    }

    editTest = (id: string) => {

      let callback = this;

      let header = "Edit Investigation Test";

      let body =
        `
        <mrs-person-investigation-test-dialog person-investigation-test-id="vm.data.id"
        person-investigation-id="vm.data.personInvestigationId" closed="vm.close()">
        </mrs-person-investigation-test-dialog>
`      ;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {

          this.data = data;

          this.close = function () {
            modalInstance.close();
          };

        }],
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
        resolve: {
          data: {
            id: id,
            personInvestigationId: callback.personInvestigationId
          }
        }
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

       let callback = this;

      let header = "Add Investigation";

      let body =
        `
<uib-tabset>
        <uib-tab heading="Recent Investigations" active="true">
           <mrs-encounter-investigation-list section="deliveryNurseExamination" closed="vm.close()" workspace-id="vm.data.workspaceId" person-id="vm.data.personId"  encounter-id ="vm.data.encounterId" person-investigation-id="vm.data.personInvestigationId"
           investigation-id="vm.data.investigationId" perform-test="vm.perform(id)"></mrs-encounter-investigation-list>
        </uib-tab>
        <uib-tab heading="New">
            <mrs-encounter-investigation-dialog encounter-id ="vm.data.encounterId" 
            person-investigation-id="-1" person-id = "vm.data.personId" 
            investigation-id = "vm.data.investigationId" saved = "vm.save(personInvestigationId)" closed = "vm.close()"></mrs-encounter-investigation-dialog>
        </uib-tab>
</uib-tabset>
`      ;

      let footer = "";

      let template: string = this.modelTemplate(header, body, footer);

      let modalInstance = this.modal.open({
        controller: ["data", function (data: any) {

             this.data = data;

          this.perform = function (personInvestigationId: string) {
            modalInstance.dismiss(personInvestigationId);
          };
          this.close = function () {
            modalInstance.close();
          };
          this.save = function (id: string) {
            modalInstance.dismiss(id);
          };

        }],
        template: template,
        controllerAs: "vm",
        size: "lg",
        backdrop: "static",
         resolve: {
          data: {
            personId: callback.personId,
            encounterId: callback.encounterId,
            workspaceId: callback.workspaceId,
            personInvestigationId: callback.personInvestigationId,
            investigationId: callback.investigationId,
          }
        }
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
      public templateUrl = "app/ui/widgets/encounter-investigation/individual.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personInvestigationId: "<",
        personId: "<",
        encounterId: "<",
        workspaceId: "<",
        investigationType: "<",
        closed: "&",
        saved: "&"

      };

    }


  }

  app.component("mrsEncounterIndividualInvestigationDialog", new Component());

}
