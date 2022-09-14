import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';

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
    this.handleSocketConnection();
  }

  settings() {
    this.app.set('port', this.port || 3000);
  }

  middlewares() {
    this.app.use(morgan('dev'));
    // this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.handleSocketConnection();
  }

  private handleSocketConnection() {
    this.io.on('connection', socket => {
      console.log('a user connected', socket.id);

      /*  socket.on('user-entry', data => {
        const { roomId, userId, userName, host, presenter } = data;
      });  */
    });
  }

  routes() {
    this.app.use(express.static(`${__dirname}/../../public/home`));

    this.app.use(express.static(`${__dirname}/../../public/room`));

    this.app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/../../public/home/index.html`);
    });

    this.app.get('/room', (req, res) => {
      res.sendFile(`${__dirname}/../../public/room/room.html`);
    });
    console.log(__dirname);
  }

  async listen() {
    this.httpServer.listen(this.app.get('port'));
    console.log('Server on port', this.app.get('port'));
  }
}

export default App;
