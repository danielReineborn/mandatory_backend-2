import React, { useEffect, useState } from "react";
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
    padding: 4px;
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
      comment: "",
      description: "",

    }
    axios.post(`/cards`, card)
      .then(response => {
        console.log(response);
        let newCard = response.data;
        let newCards = [...cards, newCard];
        setCards(newCards);
      });

    setValue("");
  }
  return (
    <Wrapper>
      <form className="form" onSubmit={onSubmit} action="">
        <input autoComplete="off" placeholder="Add card.." className="form-input" onChange={onChange} value={value} type="text" name="addcard" id="addcard" />
      </form>

    </Wrapper>
  )
}