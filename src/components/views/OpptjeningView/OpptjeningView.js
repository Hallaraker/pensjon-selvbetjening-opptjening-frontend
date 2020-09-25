import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";
import {
    getInntekter,
    getLatestPensjonsBeholdning,
    getOpptjeningByYear,
    getPensjonsBeholdningArray,
    getYearArray
} from "../../../redux/opptjening/opptjeningSelectors";
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {LineChart} from '../../elements/LineChart/LineChart';
import {FAQLinkPanel} from "../../elements/FAQLinkPanel/FAQLinkPanel";
import {OpptjeningDetailsPanel} from "../../elements/OpptjeningDetailsPanel/OpptjeningDetailsPanel";
import {InntektPanel} from "../../elements/InntektPanel/InntektPanel";
import {isDev} from "../../../common/utils";
import './OpptjeningView.less';
import {BeholdningPanel} from "../../elements/BeholdningPanel/BeholdningPanel";
import Panel from "nav-frontend-paneler";
import Tekstomrade from "nav-frontend-tekstomrade";

export const OpptjeningView = () => {
    const { t } = useTranslation(['translation', 'remarks']);
    const yearArray = useSelector(getYearArray);
    const pensjonsBeholdningArray = useSelector(getPensjonsBeholdningArray);
    const latestPensjonsBeholdning = useSelector(getLatestPensjonsBeholdning);

    const [currentYear, setYear] = useState(latestPensjonsBeholdning.year);
    const opptjening = useSelector(state => getOpptjeningByYear(state, currentYear));
    const opptjeningTwoYearsBack = useSelector(state => getOpptjeningByYear(state, currentYear-2));
    const inntekter = useSelector(getInntekter);

    return(
        <div>
            <BeholdningPanel data={latestPensjonsBeholdning}/>
            <Panel border className="panelWrapper">
                <LineChart
                    data={{"labels": yearArray, "data": pensjonsBeholdningArray}}
                    title={t("opptjening-increase-in-pension-assets-per-year")}
                    yLabel={t("opptjening-pension-assets")}
                    xLabel={t("opptjening-year")}

                />
                <Tekstomrade className="pensionAssetsText">
                    {t('opptjening-pension-assets-text')}
                </Tekstomrade>
            </Panel>
            <OpptjeningDetailsPanel data={{opptjening, opptjeningTwoYearsBack}} currentYear={currentYear} yearArray={yearArray} onChange={setYear}/>
            <InntektPanel data={{inntekter}}/>
            <FAQLinkPanel/>

            {/*Show raw data in DEVELOPMENT*/}
            {isDev() &&
                <Ekspanderbartpanel tittel="Data" className="panelWrapper">
                    <pre id="json">{JSON.stringify(opptjening, null, 4)}</pre>
                </Ekspanderbartpanel>
            }
        </div>
    )
};
