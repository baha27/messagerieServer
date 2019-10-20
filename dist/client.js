"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(server, connection) {
        this.server = server;
        this.connection = connection;
        this.usernameRegex = /^[a-zA-Z0-9]*$/;
        this.username = null;
        connection.on('message', (message) => this.onMessage(message.utf8Data));
        connection.on('close', () => { console.log(this.username + ' is logged out '); server.removeClient(this); });
    }
    sendMessage(type, data) {
        const message = { type: type, data: data };
        this.connection.send(JSON.stringify(message));
    }
    sendInstantMessage(content, author, date) {
        const instantMessage = { content: content, author: author, date: date };
        this.sendMessage('instant_message', instantMessage);
    }
    onInstantMessage(content) {
        if (!(typeof 'content' === 'string'))
            return;
        if (this.username === null)
            return;
        this.server.broadcastInstantMessage(content, this.username);
    }
    onUsername(username) {
        if (!(typeof 'username' === 'string'))
            return;
        if (!this.usernameRegex.test(username))
            return;
        this.username = username;
        this.sendMessage('login', 'ok');
    }
    onLogoutRequest() {
        this.server.removeClient(this);
        this.sendMessage('logout', 'ok');
    }
    onMessage(utf8Data) {
        const message = JSON.parse(utf8Data);
        switch (message.type) {
            case 'instant_message':
                this.onInstantMessage(message.data);
                break;
            case 'username':
                this.onUsername(message.data);
                break;
            case 'logout':
                this.onLogoutRequest();
                break;
        }
    }
}
exports.Client = Client;
