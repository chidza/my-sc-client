namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IVitalsGraph extends ng.IController {

    }

    interface IMinMaxGraph extends ng.IController {
        min: number;
        max: number;
        intervalY: number;
        intervalX: number;
        lineArray: Array<any>;

    }

    class Controller implements IVitalsGraph {



        deliveryId: string;
        vitalId: string;
        temperatureId: string;
        fetalHeartRateId: string;

        start: string;
        end: string;
        ActivePhaseVitals: Array<data.ILaborActivePhaseVitalList> = [];
        interval: number;
        activePhase: data.IActivePhase;
        times: Array<any> = [];
        width: number;
        height: number;


        // graph plotting letiables
        config = {};
        vitalListTime: Array<any>;
        vitalListValue: Array<any>;
        vitalName: string;
        vitalSymbol: string;
        vitalColor: string;
        vital = {} as data.IVital;
        unit: data.IUnit;
        lines = {} as data.ICervixViewLines;


        // graph shells to make the graph dynamic
        VitalMin: number;
        VitalMax: number;
        text: string;
        subtext: string;


        lineConfig = {};
        lineOption = {};




        static $inject = ["CervixService", "DeliveryService", "UnitService", "VitalService", "PersonVitalService", "LaborActivePhaseVitalService", "DateUtils"];
        constructor(
            private cervixService: data.ICervixService,
            private deliveryService: data.IDeliveryService,
            private unitService: data.IUnitService,
            private vitalService: data.IVitalService,
            private personVitalService: data.IPersonVitalService,
            private getVitalsForActiveLabourStageService: data.ILaborActivePhaseVitalService,
            private utils: utils.IDateUtils

        ) {

            this.vitalListTime = [];
            this.vitalListValue = [];

        }



        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            if (this.deliveryId && this.start && this.vitalId) {
                this.getVitalsForActiveLabourStageService.findForGraphsByDeliveryId(this.deliveryId, this.vitalId, this.start, this.end).then((response) => {
                    this.ActivePhaseVitals = response;

                    this.vitalService.get(this.vitalId).then((response) => {
                        this.vital = response;
                        this.vitalName = response.name;
                        this.VitalMax = response.maximum;
                        this.VitalMin = response.minimum;

                        this.unitService.get(response.unitId).then((unitresponse) => {

                            this.vitalSymbol = unitresponse.name;

                            this.cervixService.getCervixesGraphLines(this.deliveryId).then((response) => {

                                this.lines = response;

                                this.loadGraph2();

                            });



                        });
                    });

                });
            }

        }

        getClosePartogramNotifier = (): {} => {


            if (this.end) {

                return {
                    silent: true,
                    itemStyle: {
                        normal: {
                            color: "transparent",
                            opacity: 0.1

                        }
                    },
                    label: {
                        normal: {
                            formatter: "Partogram Closed",
                            textStyle: {
                                align: "center",
                                fontSize: 70,
                                color: "black"
                            }
                        }
                    },
                    data: [[{
                        name: "Partogram Closed",
                        xAxis: "min",
                        yAxis: this.VitalMin
                    },
                    {
                        xAxis: "max",
                        yAxis: this.VitalMax
                    }]]
                };


            }

        }

        getClosePartogramLine = (): {} => {


            if (this.end) {

                return {
                    normal: {
                        color: "black",
                        width: 5

                    }
                };



            }
            else {
                return {
                    normal: {
                        color: "transparent",
                        width: 5

                    }
                };

            }

        }


        getMinMaxYValues = (vitalId: string): IMinMaxGraph => {

            let minMax: IMinMaxGraph = { min: 0, max: 0, intervalY: 0, intervalX: 0, lineArray: [] };



            if (this.temperatureId) {

                minMax.max = 45;
                minMax.min = 25;
                minMax.intervalY = 1;
                minMax.intervalX = 30 * 60 * 1000;

                if (this.end) {
                    minMax.lineArray = this.lines.CloseTemp;
                }
            } else {
                minMax.max = 80;
                minMax.min = 200;
                minMax.intervalY = 10;
                minMax.intervalX = 30 * 60 * 1000;

                if (this.end) {
                    minMax.lineArray = this.lines.CloseFetalHeartRateAndPulse;

                }
            }
/* 
            switch (vitalId) {
                case 2:

                    minMax.max = 45;
                    minMax.min = 25;
                    minMax.intervalY = 1;
                    minMax.intervalX = 30 * 60 * 1000;

                    if (this.end) {
                        minMax.lineArray = this.lines.CloseTemp;
                    }

                    break;

                case 3:
                    minMax.max = 80;
                    minMax.min = 200;
                    minMax.intervalY = 10;
                    minMax.intervalX = 30 * 60 * 1000;

                    if (this.end) {
                        minMax.lineArray = this.lines.CloseFetalHeartRateAndPulse;

                    }

                    break;
            }
 */
            return minMax;

        }


        loadGraph2 = () => {

            this.lineConfig = {
                animation: true,
                theme: "roma",
                dataLoaded: true
            };

            this.lineOption = {

                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    data: [this.vitalName],
                    selectedMode: false,
                    top: 20

                },
                grid: {
                    right: 30
                },

                visualMap: {
                    show: false,
                    pieces: [{
                        gt: this.VitalMin,
                        lte: this.VitalMax,
                        color: "blue"
                    }],
                    outOfRange: {
                        color: "#991a00"
                    }
                },


                xAxis: [
                    {
                        name: "time/hr",
                        nameLocation: "end",
                        type: "time",
                        smooth: true,
                        axisLine: { onZero: false },
                        interval: this.getMinMaxYValues(this.vitalId).intervalX,
                        splitLine: { show: true },
                        splitArea: { show: false },
                        axisLabel: {

                            rotate: 45,
                            show: true,
                            formatter: function (value: any) {


                                return moment(value).format("HH:mm");



                            }

                        },
                    }

                ],
                yAxis: [
                    {

                        name: this.vitalName + "/" + "(" + this.vitalSymbol + ")",
                        nameTextStyle: {
                            fontStyle: "bold",
                            fontSize: 15,
                        },
                        nameLocation: "middle",
                        type: "value",
                        smooth: true,
                        nameGap: 37,
                        max: this.getMinMaxYValues(this.vitalId).max,
                        min: this.getMinMaxYValues(this.vitalId).min,
                        boundaryGap: [0, "100%"],
                        interval: this.getMinMaxYValues(this.vitalId).intervalY,
                        axisLine: { onZero: false },
                        axisLabel: {
                            formatter: "{value}"
                        }




                    }
                ],
                series: [
                    {
                        name: "Closed line",
                        type: "line",
                        symbolSize: 1,
                        symbol: "pin",

                        smooth: true,

                        data: this.getMinMaxYValues(this.vitalId).lineArray.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        lineStyle: this.getClosePartogramLine(),
                        itemStyle: this.getClosePartogramLine(),

                    },
                    {
                        name: [this.vitalName],
                        type: "line",
                        symbolSize: 12,
                        symbol: "circle",
                        selectedMode: false,
                        smooth: true,
                        data: this.ActivePhaseVitals.map(function (item) {
                            return {
                                name: item.value,
                                value: [item.date, item.value]
                            };
                        }),
                        lineStyle: {
                            normal: {
                                width: 1

                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 1
                            }
                        },



                        markLine: {
                            data: [
                                { name: "DANGER LINE: UPPER LIMIT", xAxis: 0, yAxis: this.VitalMax },
                                { name: "DANGER LINE: LOWER LIMIT", xAxis: 0, yAxis: this.VitalMin },



                            ],
                            itemStyle: {
                                normal: {
                                    color: ["rgb(220,20,60)"]
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: "red",
                                    width: 2
                                }
                            },
                        },
                        markArea: this.getClosePartogramNotifier(),


                    }
                ]
            };


        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/vitals-graph/graph.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                temperatureId: "<",
                fetalHeartRateId: "<",
                interval: "<",
                vitalId: "<",
                start: "<",
                end: "<",
                width: "<",
                height: "<"
            };

        }
    }

    app.component("mrsVitalsGraph", new Component());

}