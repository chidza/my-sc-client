namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtVisitNewOiDialog extends ng.IController {

    }

    class Controller implements IArtVisitNewOiDialog {
        artVisitId: string;
        newOis: Array<data.IArtQuestionaire>;
        newOi = {} as data.IArtVisitNewOi;
        artVisitNewOis: Array<data.IArtVisitNewOi>;


        static $inject = ["dialogs", "ArtQuestionaireService", "ArtVisitNewOiService"];
        constructor(dialog: ng.dialogservice.IDialogService,
            private artQuestionnaireService: data.IArtQuestionaireService,
            private artVisitNewOiService: data.IArtVisitNewOiService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = (): void => {
            this.artQuestionnaireService.getByType("NEWOI").then((response) => {
                this.newOis = response;
                this.artVisitNewOiService.getByArtVisitId(this.artVisitId).then((response) => {
                    this.artVisitNewOis = response;
                    this.newOis.forEach((oi) => {
                        for (let i = 0; i < this.artVisitNewOis.length; i++) {
                            if (oi.id === this.artVisitNewOis[i].artQuestionareId) {
                                oi.state = true;
                            }
                        }
                    });
                });
            });


        }

        addRemove = (item: data.IArtQuestionaire): void => {
            if (item.state === true) {
                this.newOi.artQuestionareId = item.id;
                this.newOi.artVisitId = this.artVisitId;
                this.artVisitNewOiService.save(this.newOi).then((response) => {

                });
            } else {
                this.artVisitNewOiService.remove(this.getArtVisitNewOiId(item.id)).then(() => {

                });
            }

        }

        getArtVisitNewOiId = (id: string): string => {
            let result = "";
            this.artVisitNewOis.forEach((oi) => {
                if (oi.artQuestionareId === id) {
                    result = oi.id;
                }
            });
            return result;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-visit-new-oi/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                artVisitId: "<"
            };

        }
    }

    app.component("mrsArtVisitNewOiDialog", new Component());

}
