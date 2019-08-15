import React from 'react';


class Main extends React.Component {
    constructor() {
        super();
        this._socket = null;
        this.state = {
            connect: false,
            userName: 'user',
            messages: [],
        };
    }
}

export default Main;