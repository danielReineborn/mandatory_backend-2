import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import axios from "axios";

const RenameModal = styled.section`
  z-index: 1;
  height: 200px;
  width: 200px;
  position: aboslute;
  top: 20%;
  left: calc(50%-100px);

`

const Backdrop = styled.div`
  z-index: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0
`
export default function RenameList({ open, id, change, setOpen }) {
  const [newName, setNewName] = useState("");

  function onChange(e) {
    let value = e.target.value;
    setNewName(value);
  }

  function onSubmit(e) {
    e.preventDefault();
    let data = {
      name: newName,
    }
    axios.patch(`/lists/${id}`, data)
      .then(result => {
        console.log(result);
        //if result setOpen(false), change(true);
      })
  }

  function backdrop() {
    setOpen(false);
  }

  if (open)
    return ReactDOM.createPortal(
      <>
        <RenameModal>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} value={newName} type="text" name="list" id="list" />
            <button type="submit">Change</button>
            <button onClick={}>Cancel</button>
          </form>
        </RenameModal>
        <Backdrop onClick={backdrop} />
      </>, document.body
    )

}