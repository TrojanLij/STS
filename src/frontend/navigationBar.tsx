import React from "react";
import { CustomComponent } from "./customComponent";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faWindowMaximize, faWindowMinimize, faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import { BrowserWindow } from "@electron/remote/";

const Warper = styled.div`
    background-color: #202225;
    color: #72767d;
    height: 20px;
    width: 100%;
    display: flex;
    user-select: none;
`;

const Title = styled.div`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
    margin-left: 5px;
    flex-grow: 1;
    -webkit-app-region: drag; // allows window dragging
`;

const ButtonContainer = styled.div` 
    overflow: hidden;
`;

const Button = styled.button`
    background-color: transparent;
    color: #72767d;
    border: none;
    font-size: 10px;
    padding: 5px;
    :hover {
        background-color: #282b2e;
    }
`;
const ButtonExit = styled.button`
    background-color: transparent;
    color: #72767d;
    border: none;
    font-size: 10px;
    padding: 5px;
    :hover {
        background-color: red;
    }
`;


export default class TitleBar extends CustomComponent {
    minimize = () => {
        BrowserWindow.getFocusedWindow().minimize();
    };
    maximize = () => {
        if (this.isMaximized) {
            BrowserWindow.getFocusedWindow().unmaximize();
        } else {
            BrowserWindow.getFocusedWindow().maximize();
        }
        this.forceUpdate();
    };
    exit = () => {
        BrowserWindow.getFocusedWindow().close();
    };
    get isMaximized() {
        return BrowserWindow.getFocusedWindow().isMaximized();
    }
    render() {
        return <Warper>
            <Title>
                STS
            </Title>
            <ButtonContainer>
                <Button onClick={this.minimize}>
                    <FontAwesomeIcon icon={faWindowMinimize} />
                </Button>
                <Button onClick={this.maximize}>
                    <FontAwesomeIcon icon={this.isMaximized ? faWindowRestore : faWindowMaximize} />
                </Button>
                <ButtonExit onClick={this.exit}>
                    <FontAwesomeIcon icon={faTimes} />
                </ButtonExit>
            </ButtonContainer>
        </Warper>;
    }
}
