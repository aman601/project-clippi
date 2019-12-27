import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { comboFilter } from "@/lib/realtime";
import { ComboFilterSettings } from "@vinceau/slp-realtime";
import { ComboFinder } from "./ComboFinder";
import { ComboForm } from "./ComboForm";
import styled from "styled-components";

export const SettingsPage: React.FC<{
    showSettings: boolean;
}> = props => {
    const SettingsContainer = styled.div`
        position: absolute;
        width: 100%;
        height: ${props.showSettings ? "100%" : "0"};
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 1;
        overflow: hidden;
    `;
    const settings = useSelector((state: iRootState) => state.slippi.settings);
    const initial = comboFilter.updateSettings(JSON.parse(settings));
    const dispatch = useDispatch<Dispatch>();
    const onSubmit = (values: Partial<ComboFilterSettings>) => {
        const newValues = comboFilter.updateSettings(values);
        console.log(`updated combo filter with new values: ${newValues}`);
        const valueString = JSON.stringify(newValues);
        console.log(`updating redux store: ${valueString}`);
        dispatch.slippi.updateSettings(valueString);
    };
    return (
        <SettingsContainer>
            <h1>Settings</h1>
            <ComboFinder />
            <ComboForm initialValues={initial} onSubmit={onSubmit} />
        </SettingsContainer>
    );
};
