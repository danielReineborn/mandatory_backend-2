import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import CardModal from "./CardModal";
const CardWrapper = styled.div`
  height: 40px;
  width: 90%;
  margin: 8px 8px 0px 8px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
  }

  p {
    margin: 0px 0px 0px 8px;
    font-size: 0.8rem;
  }
`

export default function Card({ change, card, lists }) {
  const [openCard, setOpenCard] = useState(false);
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    axios.get(`/checklists/${card._id}`)
      .then(response => {
        let data = response.data.data;
        console.log(data);
        setTodos(data);
      })
      .catch(e => {
        console.error(e);
      })
  }, [])

  return (
    <CardWrapper onClick={() => setOpenCard(true)}>
      <p>{card.name}</p>
      <CardModal
        lists={lists}
        listId={card.list}
        change={change}
        card={card}
        open={openCard}
        close={setOpenCard}
        setTodos={setTodos}
        todos={todos}
      />
    </CardWrapper>
  )
}