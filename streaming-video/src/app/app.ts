import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import path from 'path';

class App {
  private httpServer: HTTPServer;

  private app: Application;

  private io: SocketIOServer;

  private activeSockets: string[] = [];

  constructor(private port?: number | string) {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set('port', this.port || 3000);
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use((req, res, next): void => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173/');
      res.header('Access-Control-Allow-Headers', '*');
      res.header('Access-Control-Allow-Methods', '*');
      next();
    });
  }

  private handleSocketConnection() {
    this.io.on('connection', socket => {
      const checkExistingSocket = this.activeSockets.find(
        existingSocket => existingSocket === socket.id,
      );

      if (!checkExistingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit('update-user-list', {
          users: this.activeSockets.filter(
            existingSocket => existingSocket !== socket.id,
          ),
        });

        socket.broadcast.emit('update-user-list', {
          users: [socket.id],
        });
      }

      socket.on('call-user', (data: any) => {
        socket.to(data.to).emit('call-made', {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on('make-answer', data => {
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer,
        });
      });

      socket.on('reject-call', data => {
        socket.to(data.from).emit('call-rejected', {
          socket: socket.id,
        });
      });

      socket.on('disconnect', () => {
        this.activeSockets = this.activeSockets.filter(
          existingSocket => existingSocket !== socket.id,
        );
        socket.broadcast.emit('remove-user', {
          socketId: socket.id,
        });
      });
    });
  }

  routes() {
    this.app.use(express.static(`${__dirname}/../../public/home`));
    this.app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/../../public/home/index.html`);
    });
  }

  async listen() {
    this.app.listen(this.app.get('port'));
    console.log('Server on port', this.app.get('port'));
  }
}

export default App;
