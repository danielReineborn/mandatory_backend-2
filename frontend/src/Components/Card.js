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
`

export default function Card({ card }) {
  const [openCard, setOpenCard] = useState(false);
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    axios.get(`/checklists/${card._id}`)
      .then(response => {
        console.log(response)
        let data = response.data.data;
        setTodos(data);
      })
  }, [])

  // hantera onchange på todos Form. 
  return (
    <CardWrapper onClick={() => setOpenCard(true)}>
      <p>{card.name}</p>
      <CardModal
        listId={card.list}
        card={card}
        open={openCard}
        close={setOpenCard}
        /* todoChange={onChange} */
        todos={todos}
      />
    </CardWrapper>
  )
}