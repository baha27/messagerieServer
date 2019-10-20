import {server as WebSocketServer, connection as WebSocketConnection} from 'websocket';
import * as http from 'http';
import { Client } from "./client";

export class Server {

    private clients: Client[] = [];


    public constructor(port: number) {
        const server = this.createAndRunHttpServer(port);
        this.addWebSocketServer(server);
    }
                    /* ---------- Configuration -------------------- */
    private createAndRunHttpServer(port: number): http.Server {
        const server = http.createServer(function(request, response) {
            response.writeHead(404);
            response.end();
        });
        server.listen(port, function() {
            console.log((new Date()) + ' Server is listening on port '+port);
        });
        return server;
    }
    private addWebSocketServer(httpServer: http.Server): void {
        const webSocketServer = new WebSocketServer({
            httpServer: httpServer,
            autoAcceptConnections: false
        });
        webSocketServer.on('request', request=>this.onWebSocketRequest(request));
    }
    private onWebSocketRequest(request): void {
        const connection = request.accept(null, request.origin);
        const client = new Client(this, connection);
        this.clients.push(client);
    }
                    /* ----------------------------------------------------- */

    public broadcastInstantMessage(content: string, author: string): void {
        const date = new Date();
        for (const client of this.clients) {
          client.sendInstantMessage(content, author, date);
        }
      }

    public welcomeNewClient( client: Client) {
        for (const client of this.clients){

        }
    }
    
    public removeClient(client: Client) {
        this.clients.splice(this.clients.indexOf(client), 1);
    }

    public getClients(){
        return this.clients ; 
    }

}