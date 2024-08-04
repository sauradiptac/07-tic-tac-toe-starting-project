import { useState } from "react";

export default function Player({initialName, symbol, isActive, onSaveClick}){

    const [isEditing, setIsEditing] = useState(false); 
    const [enteredName, setEnteredName] = useState(initialName);

    function handleEditSave(){
        setIsEditing(() => !isEditing);
        onSaveClick(symbol,enteredName);
      }

    function handleChange(event){
        setEnteredName(event.target.value);
    }  

    let buttonTitle = "Edit";
    let spanContent = (<span className="player">
        <span className="player-name">{enteredName}</span>
        <span className="player-symbol">{symbol}</span>
      </span>);
    if(isEditing){
        buttonTitle = "Save"
        spanContent=(<span className="player">
            <input type="text" required value={enteredName} onChange={handleChange}></input>
            <span className="player-symbol">{symbol}</span>
          </span>);
    }

    return(
        <li className={isActive ? 'active' : undefined}>
            {spanContent}
            <button onClick={handleEditSave}>{buttonTitle}</button>
        </li>
    );
}