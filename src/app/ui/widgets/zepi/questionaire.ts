
namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IZepiQuestionaire extends ng.IController {

    }


    class Controller implements IZepiQuestionaire {

        zepiVisitId: string;
        categoryName: string;
        zepiQuestionList: Array<data.IPncQuestionaire> = [];
        pncQuestionList: Array<data.IPncQuestionaire> = [];
        pncId: string;
        zepiExaminationList: Array<data.IZepiExaminationQuestion>;
        zepiExaminationQuestionData = {} as data.IZepiExaminationQuestion;
        zepiValue: string;
        zepiExaminationQuestion: data.IZepiExaminationQuestion;


        static $inject = ["ZepiExaminationQuestionService", "ZepiQuestionaireService"];

        constructor(
            private zepiExaminationQuestionService: data.IZepiExaminationQuestionService,
            private zepiQuestionaireService: data.IZepiQuestionaireService,

        ) {

        }

        $onInit = () => {

            this.zepiQuestionaireService.getByType(this.categoryName).then((response) => {
                this.zepiQuestionList = response;


            });



            this.zepiExaminationQuestionService.getByzepiExaminationQuestionId(this.zepiVisitId).then((response) => {
                this.zepiExaminationList = response;
                console.log(response);

            });

        }



        getZepiPropertyIdFromZepiQestionId = (id: string): string => {
            let zepiId = "";
            if (this.zepiExaminationList != null) {
                this.zepiExaminationList.forEach((type) => {
                    if (type.zepiExaminationQuestionId === id) {
                        zepiId = type.id;
                    }
                });

            }
            return zepiId;
        }


        isExist = (id: string): boolean => {
            let checked = false;
            if (this.zepiExaminationList != null) {
                this.zepiExaminationList.forEach((type) => {
                    if (type.zepiExaminationQuestionId === id) {
                        this.zepiValue = type.value;
                        checked = true;
                    }
                });

            }
            return checked;
        }

        save = (item: data.IZepiQuestionaire) => {

            if (this.isExist(item.id) === true) {

                this.zepiExaminationQuestionData.id = this.getZepiPropertyIdFromZepiQestionId(item.id);
                this.zepiExaminationQuestionService.remove(this.zepiExaminationQuestionData.id).then((response) => {

                });
            }
            else {

                this.zepiExaminationQuestionData.zepiExaminationQuestionId = item.id;
                this.zepiExaminationQuestionData.zepiVisitId = this.zepiVisitId;
                this.zepiExaminationQuestionService.save(this.zepiExaminationQuestionData).then((response) => {


                });
            }

        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/zepi/questionaire.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {

                categoryName: "@",
                personId: "<"

            };

        }
    }

    app.component("mrsZepiQuestionaireDialog", new Component());

}
