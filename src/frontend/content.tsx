import React from "react";
import { CustomComponent } from "./customComponent";
import styled from "styled-components";

const Warper = styled.div`
    background-color: #36393f;
    color: #72767d;
    height: 100%;
    width: 100%;

`;

export default class Content extends CustomComponent {
    render() {
        return <Warper>
            WIP
        </Warper>;
    }
}
