import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";


const Wrapper = styled.footer`
  margin: 8px;
  width: 90%;

  .form {
    width: 100%;
  }

  .form-input {
    height: 40px;
    padding: 8px;
    border: none;
    border-radius: 4px;
    outline: none;
    width: 100%;
    background-color: #E5EFF5;
    :focus {
      background-color: #ffffff;
    }
  }
`

export default function AddCard({ listId, setCards, cards }) {

  const [value, setValue] = useState("");

  function onChange(e) {
    let input = e.target.value;
    setValue(input);
  }

  function onSubmit(e) {
    e.preventDefault();
    let card = {
      list: listId,
      name: value,
      description: "",
    }
    axios.post(`/cards`, card)
      .then(response => {
        if (response.status === 201) {
          let newCard = response.data;
          let newCards = [...cards, newCard];
          setCards(newCards);

        }
      })
      .catch(e => {
        console.error(e);
      })

    setValue("");
  }
  return (
    <Wrapper>
      <form className="form" onSubmit={onSubmit} action="">
        <input autoComplete="off" placeholder="Add card.." className="form-input" onChange={onChange} value={value} type="text" name="addcard" />
      </form>

    </Wrapper>
  )
}