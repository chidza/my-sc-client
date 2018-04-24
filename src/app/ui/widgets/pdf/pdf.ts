declare var PDFJS: any;

namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);  

    class Controller implements ng.IController {

        // spinnerActive: any;
        pdfDoc: any = null;
        pageNum: number = 1;
        numPages: number;
        pageRendering: boolean = false;
        pageNumPending: number = null;
        scale: number = 1.2;
        canvas: HTMLCanvasElement;
        ctx: any;
        spinnerId: string = "#spinner";

        public close: () => void;

        static $inject = ["dialogs", "$timeout"];
        constructor(private dialog: ng.dialogservice.IDialogService,
            private timeout: ng.ITimeoutService) {

        }

        $onInit = (): void => {
            this.canvas = <HTMLCanvasElement>document.getElementById("the-canvas");
            this.ctx = this.canvas.getContext("2d");
            PDFJS.workerSrc = "lib/pdfjs-dist/build/pdf.worker.js";
        }

        $onChanges = (changes: ng.IOnChangesObject): void => {
            if ((changes["url"]) && (changes["url"].currentValue)) {

                angular.element(this.spinnerId).show();

                PDFJS.getDocument(changes["url"].currentValue).then((pdfDoc_: any) => {
                    angular.element(this.spinnerId).hide();

                    this.pdfDoc = pdfDoc_;

                    // Initial/first page rendering
                    this.renderPage(this.pageNum);

                    this.timeout(() => { this.numPages = this.pdfDoc.numPages; }, 1000);

                }, () => {
                    angular.element(this.spinnerId).hide();
                    this.dialog.notify("Error", "Something wicked happend");
                });

            }
        }

        renderPage = (num: number): void => {
            this.pageRendering = true;
            // Using promise to fetch the page
            this.pdfDoc.getPage(num).then((page: any) => {
                let viewport = page.getViewport(this.scale);
                this.canvas.height = viewport.height;
                this.canvas.width = viewport.width;

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: this.ctx,
                    viewport: viewport
                };

                let renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(() => {
                    this.pageRendering = false;

                    if (this.pageNumPending !== null) {
                        // New page rendering is pending
                        this.renderPage(this.pageNumPending);
                        this.pageNumPending = null;
                    }

                });

            });

        }

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        queueRenderPage = (num: any): void => {
            if (this.pageRendering) {
                this.pageNumPending = num;
            } else {
                this.renderPage(num);
            }
        }

        onPrevPage = (): void => {
            if (this.pageNum <= 1) {
                return;
            }

            this.pageNum--;

            this.queueRenderPage(this.pageNum);

        }

        onNextPage = (): void => {
            if (this.pageNum >= this.pdfDoc.numPages) {
                return;
            }

            this.pageNum++;

            this.queueRenderPage(this.pageNum);

        }

        onClose = (): void => {
            if (this.close != null) {
                this.close();
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/pdf/pdf.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                url: "<",
                close: "&"
            };
        }

    }

    app.component("mrsPdfViewer", new Component());

}
