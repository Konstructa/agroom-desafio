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
      console.log('Socket connected.', socket);
    });
  }

  routes() {
    this.app.use('/', (req, res) => {
      res.json({ status: 'Hello world' });
    });
  }

  async listen() {
    this.app.listen(this.app.get('port'));
    console.log('Server on port', this.app.get('port'));
  }
}

export default App;
