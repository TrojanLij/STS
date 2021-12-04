import React from "react";
import { CustomComponent } from "./customComponent";
import styled from "styled-components";
import TitleBar from "./navigationBar";
import Content from "./content";

const Warper = styled.div`
    background-color: black;
    color: black;
    height: 100%;
    width: 100%;
    display:flex;
    flex-direction: column;
`;

export default class Main extends CustomComponent {
    render() {
        return <Warper>
            <TitleBar />
            <Content/>
        </Warper>;
    }

}
