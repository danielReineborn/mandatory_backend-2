import React from "react";
import styled from "styled-components";
import axios from "axios";

const CardWrapper = styled.div`
  height: 40px;
  width: 90%;
  margin: 8px 8px 0px 8px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  display: flex;
  align-items: center;
`

export default function Card({ card }) {

  return (
    <CardWrapper>
      <p>{card.name}</p>
    </CardWrapper>
  )
}