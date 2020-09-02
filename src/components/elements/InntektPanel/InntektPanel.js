import {formatAmount} from "../../../common/utils";
import React from "react";
import {useTranslation} from "react-i18next";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import 'nav-frontend-tabell-style';
import "./InntektPanel.less"

const detailRow = (props) => {
    return(
        <tr>
            <td>{props.label}</td>
            <td>{props.amount}</td>
        </tr>
    )
};
const buildDetailRows = (inntekter, t)  => {
    const details = [];
    inntekter.forEach((inntekt, idx) => {
        details.push(detailRow(
            {
                "key": idx,
                "label": inntekt.year,
                "amount": formatAmount(inntekt.pensjonsgivendeInntekt)
            }
        ))
    });
    return details.reverse();
};

const detailsTitle = (title) => {
    return(
        <div className="inntektDetailTitle">{title}</div>
    )
};

export const InntektPanel = (props) => {
    const { t } = useTranslation();
    const inntekter = props.data.inntekter;
    const details = buildDetailRows(inntekter, t);

    return(
        <Ekspanderbartpanel tittel={detailsTitle("Inntekter")} border className="panelWrapper">
            <div className="inntektDetailsBox">
                <table className="tabell">
                    <thead>
                        <tr>
                            <th>{t('opptjening-year')}</th>
                            <th>{t('opptjening-income')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details}
                    </tbody>
                </table>
            </div>
        </Ekspanderbartpanel>
    )
};
