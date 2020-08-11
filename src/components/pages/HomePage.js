import React from 'react';
import {useTranslation} from "react-i18next";
import {OpptjeningContainer} from "../../containers/OpptjeningContainer";
import {OpptjeningView} from "../views/OpptjeningView";
import {TopBanner} from "../elements/TopBanner/TopBanner";
import {LanguageSelector} from "../elements/LanguageSelector/LanguageSelector";
import './HomePage.less';

export const HomePage = () => {
    const { t } = useTranslation();
    return (
        // Move GRID to separate re-usable template
        <div>
            <TopBanner title="opptjening-title" text="opptjening-intro-text"/>
            <div className="mainBody">
                <OpptjeningContainer>
                    <div className="contentWrapper">
                        <LanguageSelector/>
                        <OpptjeningView/>
                    </div>
                </OpptjeningContainer>
            </div>
        </div>
    )
};
