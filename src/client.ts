import {connection as WebSocketConnection} from 'websocket';
import { Server } from './server';

export class Client {
    private usernameRegex = /^[a-zA-Z0-9]*$/;
    public username: string = null;

    public constructor(private server: Server, private connection: WebSocketConnection){
        connection.on('message', (message)=> this.onMessage(message.utf8Data));
        connection.on('close', ()=>{ console.log(this.username + ' is logged out '); server.removeClient(this);});

    }

    private sendMessage(type: string, data: any): void {
        const message = {type: type, data: data};
        this.connection.send(JSON.stringify(message));
    }

    public sendInstantMessage(content: string, author: string, date: Date) {
        const instantMessage = { content: content, author: author, date: date };
        this.sendMessage('instant_message', instantMessage);
    }

    private onInstantMessage(content): void {
        if (!(typeof 'content' === 'string')) return;
        if (this.username === null) return;
        this.server.broadcastInstantMessage(content,this.username);
    }

    private onUsername(username) {
        if (!(typeof 'username' === 'string')) return;
        if (!this.usernameRegex.test(username)) return;
        this.username = username;
        this.sendMessage('login', 'ok');
    }

    private onLogoutRequest(){
        this.server.removeClient(this);
        this.sendMessage('logout','ok');
    }

    private onMessage(utf8Data: string): void {
        const message = JSON.parse(utf8Data);
        switch (message.type) {
            case 'instant_message': this.onInstantMessage(message.data); break;
            case 'username': this.onUsername(message.data); break;
            case 'logout' : this.onLogoutRequest(); break;
        }
    }

}