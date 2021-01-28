import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Chart from 'chart.js';
import { useRef, useEffect } from 'react';
import 'nav-frontend-tabell-style';
import {formatAmount, formatNumber} from "../../../common/utils";
import './LineChart.less';
import {Knapp} from "nav-frontend-knapper";
import {CLICK_EVENT, logToAmplitude} from "../../../common/amplitude";
import {BORN_AFTER_1962, BORN_IN_OR_BETWEEN_1954_AND_1962} from "../../../common/userGroups";
import {PanelTitle} from "../PanelTitle/PanelTitle";

const amountRow = (amount, t) => {
    if(amount!==0) {
        return (
            <div>{formatAmount(amount)}</div>
        )
    } else{
        return (
            <div>{t('chart-ingen-pensjonsbeholdning')}</div>
        )
    }
};

const amountListItem = (amount, t) => {
    if(amount!==0) {
        return (
            <span>kr {formatAmount(amount)}</span>
        )
    } else{
        return (
            <span>{t('chart-ingen-pensjonsbeholdning')}</span>
        )
    }
};

const dataRow = (props) => {
    const {key, label, data, userGroup, t} = props;
    const pensjonsbeholdningTxt = data.pensjonsbeholdning != null ? amountRow(data.pensjonsbeholdning, t) : amountRow(0, t);
    const pensjonspoeng = data.pensjonspoeng;
    return(
        <tr key={key} className="row">
            <td data-testid="tableDataYear">{label}</td>
            <td data-testid="tableDataPensjonsbeholdning">{pensjonsbeholdningTxt}</td>
            {userGroup===BORN_IN_OR_BETWEEN_1954_AND_1962 && <td data-testid="tableDataPensjonspoeng">{pensjonspoeng!=null ? formatNumber(pensjonspoeng) : null}</td>}
        </tr>
    )
};

const listItem = (props) => {
    const {key, label, data, userGroup, t} = props;
    const pensjonsbeholdningTxt = data.pensjonsbeholdning != null ? amountListItem(data.pensjonsbeholdning, t) : amountListItem(0, t);
    const pensjonspoeng = data.pensjonspoeng;
    return(
        <li className="beholdningPoengItem" key={key}>
            <ul>
                <li><b>{t("chart-aar")+": "} {label}</b></li>
                <li>{t("chart-pensjonsbeholdning")+": "} {pensjonsbeholdningTxt}</li>
                {userGroup === BORN_IN_OR_BETWEEN_1954_AND_1962 && <li>{t('chart-pensjonspoeng')+": "} {pensjonspoeng!==null ? formatNumber(pensjonspoeng) : null}</li>}
            </ul>
        </li>
    )
};

const buildData = (tableMap, userGroup, t)  => {
    let dataRows = [];
    let dataListItems = [];
    Object.keys(tableMap).forEach((year, idx) => {
        const props = {
            "key": idx,
            "label": year,
            "data": tableMap[year],
            "userGroup": userGroup,
            "t": t
        };
        dataRows.push(dataRow(props))
        dataListItems.push(listItem(props))
    });
    return {dataRows, dataListItems};
};

const emptyFn = ()=>{};

const removeYearsWithNullOpptjeningAndSetPensjonsbeholdningNullTo0 =  (opptjeningMap) => {
    //Make a copy of opptjeningData before filtering
    const opptjeningMapCopy = {...opptjeningMap};

    Object.keys(opptjeningMapCopy).every((year) => {
        if(opptjeningMapCopy[year].pensjonsbeholdning == null){
            opptjeningMapCopy[year].pensjonsbeholdning = 0;
        }
        if(opptjeningMapCopy[year].pensjonsbeholdning === null && (opptjeningMapCopy[year].pensjonspoeng === null || opptjeningMapCopy[year].pensjonspoeng === 0)){
            delete opptjeningMapCopy[year];
        }
        return true;
    });
    return opptjeningMapCopy
};

export const LineChart = (props) => {
    const { t } = useTranslation();
    const {data, userGroup} = props
    const yearLabel = t("chart-aar");
    const pensjonsbeholdningLabel = t("chart-pensjonsbeholdning");
    const pensjonsbeholdningKrLabel = t("chart-pensjonsbeholdning-kr");
    const pensjonspoengLabel = t('chart-pensjonspoeng');
    const chartRef = useRef(null);
    const tableMap = removeYearsWithNullOpptjeningAndSetPensjonsbeholdningNullTo0(data);
    const chartMap = removeYearsWithNullOpptjeningAndSetPensjonsbeholdningNullTo0(data);
    const chartConfig = {
        type: 'line',
        data: {
            labels: Object.keys(chartMap),
            datasets: [
                {
                    label: pensjonsbeholdningLabel,
                    fill: false,
                    borderColor: "#005B82",
                    borderWidth: 2,
                    backgroundColor: "#ffffff",
                    tension: 0,
                    radius: 3.5,
                    pointBackgroundColor: '#005B82',
                    data: Object.values(chartMap).map((prop) => prop.pensjonsbeholdning),
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: 'rgba(62, 56, 50, 0.38)',
                    pointHoverBorderColor: 'rgba(62, 56, 50, 0.45)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            onHover: (event, chartElement) => {
                event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            },
            onClick: function(event, item){
                if(item && item[0]){
                    props.onclick ? props.onclick(Object.keys(chartMap)[item[0]._index]) : emptyFn();

                }
            },
            legend:{
                display: false
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 50,
                    bottom: 50
                }
            },
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            color: "#78706A"
                        },

                        ticks: {
                            maxTicksLimit: 5,
                            maxRotation: 0,
                            minRotation: 0,
                            fontColor: "#3E3832",
                            fontSize: 14
                        }

                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                            color: "#78706A"
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return 'kr ' + formatAmount(value);
                            },
                            fontColor: "#3E3832",
                            fontSize: 14
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    beforeLabel: function(tooltipItem, data) {
                        return t('chart-pensjonsbeholdning') + ":";
                    },
                    label: function(tooltipItem, data) {
                        const year = data['labels'][tooltipItem['index']];
                        const tooltipBeholdning = chartMap[year].pensjonsbeholdning==null || chartMap[year].pensjonsbeholdning===0 ?
                            t('chart-ingen-pensjonsbeholdning', {year: year - 2}) :
                            'kr ' + formatAmount(chartMap[year].pensjonsbeholdning);

                        if(userGroup===BORN_IN_OR_BETWEEN_1954_AND_1962){
                            return [tooltipBeholdning, '',t('chart-pensjonspoeng') + ': ' + formatNumber(chartMap[year].pensjonspoeng)];
                        } else {
                            return tooltipBeholdning;
                        }
                    },
                },
                backgroundColor: '#005B82',
                titleFontSize: 16,
                titleFontColor: '#ffffff',
                bodyFontColor: '#ffffff',
                bodyFontSize: 14,
                displayColors: false,
                borderColor: '#000000',
                borderWidth: 1,
                cornerRadius: 0,
                yPadding: 20,
                xPadding: 15,
                caretSize: 10,
                bodySpacing: 5,
            }
        }
    };

    useEffect(() => {
        if (!chartRef) return;
        const ctx = chartRef.current.getContext("2d");
        if(!ctx) return;
        new Chart(ctx, chartConfig);
    });

    let initialState = "chart";

    if(userGroup===BORN_IN_OR_BETWEEN_1954_AND_1962){
        initialState = "table";
    }

    const [visibleComponent, setVisibleComponent] = useState(initialState);
    const {dataRows, dataListItems} = buildData(tableMap, userGroup, t);

    const toggleVisibleComponent = (component) => {
        const loggerName = (component === "chart") ? "Graf" : "Tabell";
        logToAmplitude({eventType: CLICK_EVENT, name: loggerName, titleKey: "chart-pensjonsbeholdningen-din", type: "Knapp", value: true});
        setVisibleComponent(component);
    };

    let chartClass = "chartContainer";
    let tableClass = "tableContainer hidden";
    let chartButton = "chartButton selected";
    let tableButton = "tableButton";

    if(visibleComponent === "chart"){
        chartClass = "chartContainer";
        tableClass = "dataContainer hidden";
        chartButton = "selected";
        tableButton = ""
    } else if (visibleComponent === "table"){
        chartClass = "chartContainer hidden";
        tableClass = "dataContainer";
        chartButton = "";
        tableButton = "selected";
    }

    const ChartKnapp = (props) => {return (<Knapp mini className={chartButton + " " + props.className} onClick={() => toggleVisibleComponent("chart")}>{t('chart-graf')}</Knapp>)}
    const TableKnapp = (props) => {return (<Knapp mini className={tableButton + " " + props.className} onClick={() => toggleVisibleComponent("table")}>{t('chart-tabell')}</Knapp>)}

    let title, buttons;
    if(userGroup === BORN_AFTER_1962) {
        title = t("chart-pensjonsbeholdningen-din");
        buttons = (
            <div className="buttonContainer">
                <ChartKnapp className="leftButton"/>
                <TableKnapp/>
            </div>
        )
    } else if (userGroup === BORN_IN_OR_BETWEEN_1954_AND_1962) {
        title = t("chart-pensjonsbeholdningen-og-pensjonspoengene-dine");
        buttons = (
            <div className="buttonContainer">
                <TableKnapp className="leftButton"/>
                <ChartKnapp/>
            </div>
        )
    }

    return(
        <div>
            <div className="chartTitleContainer">
                <PanelTitle id="chartTitle" titleString={title}/>
                {buttons}
            </div>
            <div className={chartClass} data-testid="chartContainer">
                <canvas ref={chartRef}/>
            </div>
            <div className={tableClass} data-testid="dataContainer">
                <div className="tableContainer">
                    <table className="tabell beholdningAndPoengTabell">
                        <thead>
                        <tr className="row">
                            <th data-testid="tableHeaderYear" className="column1">{yearLabel}</th>
                            <th data-testid="tableHeaderPensjonsbeholdning" className="column2">{pensjonsbeholdningKrLabel}</th>
                            {userGroup===BORN_IN_OR_BETWEEN_1954_AND_1962 && <th data-testid="tableHeaderPensjonspoeng" className="column3">{pensjonspoengLabel}</th>}
                        </tr>
                        </thead>
                        <tbody>
                            {dataRows.reverse()}
                        </tbody>
                    </table>
                    <ul className="beholdningAndPoengList">
                        {dataListItems.reverse()}
                    </ul>
                </div>

            </div>
        </div>
    );
};
