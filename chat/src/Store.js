import React, { useState } from 'react';
import { CommunicationStayCurrentLandscape } from 'material-ui/svg-icons';

export const CTX = React.createContext();

const initState = {
    general: [ ],
}

let socket = null;
let connect = false;

 function Store(props) { 

    const user = 'cqxg' + Math.random(100).toFixed(2);
    const [allChats] = React.useReducer(reducer, initState);

    return (
        <CTX.Provider value = {{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}

const Web = ()  => {
    if (connect === false) socket = new WebSocket('ws://st-chat.shas.tel');
    socket.onmessage = (e) => {
        console.log(JSON.parse(e.data));
            initState.general.push({ from: JSON.parse(e.data)[0].from, message: JSON.parse(e.data)[0].message });
            console.log(initState.general);
    }
}

function sendChatAction (value) {
    Web();
    socket.onopen = () => {
        console.log('OPEN'); 
        socket.send(value);
    }      
}

export default Store;

function reducer(state, action) {
    const {from, message, topic} = action.payload;
    switch(action.type) {
        case 'RECEIVE_MESSAGE':
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    {from, message}
                ]
            }
        default:
            return state
    }
}

export {Web}