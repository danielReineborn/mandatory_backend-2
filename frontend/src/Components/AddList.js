import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  margin: 16px 0px 0px 8px;
  width: 250px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  flex: 0 0 auto;

  .addlist-input {
    height: 40px;
    width: 100%;
    background-color: #E5EFF5;
    border: none;
    outline: none;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    :focus {
      background-color: #ffffff;
    }
    ::placeholder {
      font-weight: bold;
      font-size: 14px;
    }
  }
`

export default function AddList({ lists, setLists }) {
  const [value, setValue] = useState("");

  function onChange(e) {
    let input = e.target.value;

    setValue(input);
  }

  function onSubmit(e) {
    e.preventDefault();

    let list = {
      name: value,
    }
    axios.post("/lists", list)
      .then(response => {
        if (response.status === 201) {
          let newList = response.data
          let newLists = [...lists, newList];
          setLists(newLists);

        }
      })
      .catch(e => {
        console.error(e);
      })

    setValue("");
  }
  return (
    <Wrapper>
      <form onSubmit={onSubmit} className="" action="">
        <input
          autoComplete="off"
          onChange={onChange}
          value={value}
          className="addlist-input"
          placeholder="Add list.."
          type="text"
          name="addlist"
          id="addlist"
        />
      </form>
    </Wrapper>
  )
}