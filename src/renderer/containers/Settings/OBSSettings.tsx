import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Icon } from "semantic-ui-react";

import { ConnectionStatusCard } from "@/components/ConnectionStatusCard";
import { connectToOBSAndNotify, obsConnection, OBSConnectionStatus } from "@/lib/obs";
import { Dispatch, iRootState } from "@/store";

import OBSLogo from "@/styles/images/obs.png";
import { FormContainer, Field, Label, PageHeader } from "@/components/Form";

export const OBSSettings = () => {
    const { obsAddress, obsPort, obsPassword } = useSelector((state: iRootState) => state.slippi);
    const { obsConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const obsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;
    const dispatch = useDispatch<Dispatch>();
    const header = obsConnected ? "Connected" : "Disconnected";
    const color = obsConnected ? "#00E461" : "#F30807";
    const subHeader = `${obsAddress}:${obsPort}`;
    const [showPass, setShowPass] = React.useState(false);
    const togglePass = () => {
        setShowPass(!showPass);
    };

    return (
    <FormContainer>
        <PageHeader>OBS Configuration</PageHeader>
        {obsConnected ?
            <ConnectionStatusCard
                header={header}
                subHeader={subHeader}
                userImage={OBSLogo}
                statusColor={color}
                onDisconnect={() => obsConnection.disconnect()}
                shouldPulse={obsConnected}
            />
            :
            <Form onSubmit={connectToOBSAndNotify}>
                <Field>
                    <Label>IP Address</Label>
                    <Form.Input
                        placeholder="localhost"
                        value={obsAddress}
                        onChange={(e) => { dispatch.slippi.setOBSAddress(e.target.value); }}
                    />
                </Field>
                <Field>
                    <Label>Port</Label>
                    <Form.Input
                        placeholder="4444"
                        value={obsPort}
                        onChange={(e) => { dispatch.slippi.setOBSPort(e.target.value); }}
                    />
                </Field>
                <Field>
                    <Label>Websocket Password</Label>
                    <Form.Input
                        icon={<Icon name="eye" link={true} onClick={togglePass} />}
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        value={obsPassword}
                        onChange={(e) => { dispatch.slippi.setOBSPassword(e.target.value); }}
                    />
                </Field>
                <Button primary type="submit">Connect</Button>
            </Form>
        }
    </FormContainer>
    );
};
