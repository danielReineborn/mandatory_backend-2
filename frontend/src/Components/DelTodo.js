import React from "react";
import axios from "axios";
import styled from "styled-components";

const Delete = styled.button`
  
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
    :hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.3);
      color: #ffffff;
    
    }  
  `

export default function DelTodo({ id, todos, setTodos }) {

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Bubble?")
    axios.delete(`/checklists/${id}`)
      .then(result => {
        if (result.status === 204) {
          let newTodos = todos.filter(x => x._id !== id);
          setTodos(newTodos);
        }
      })
      .catch(e => {
        console.error(e);
      })
  }
  return (
    <Delete onClick={onClick} className="btn-exit">x</Delete>
  )
}