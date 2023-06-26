import express from 'express'
import './dotenv.js'
import http from 'http'
import cors from 'cors'
import morgan from 'morgan' // log
import bodyParser from 'body-parser' // 요청정보 처리

/* Router */
import uploadRouter from './routes/uploads.js';
import loginRouter from './routes/login.js';
import signupRouter from './routes/signup.js';
import graphRouter from './routes/graphs.js';
import notificationRouter from './routes/notification.js';
import myinfoRouter from './routes/myInfo.js';
import tagRouter from './routes/tag.js'; 

import cardRouter from './routes/cards.js';
import socialRouter from './routes/social.js';
import userRouter from './routes/user.js'; 
import searchRouter from './routes/search.js';
import mypageRouter from './routes/mypage.js';
import dummyRouter from './routes/z_dummy.js';

import { authMiddleware } from './middlewares/auth-middleware.js';
import { setTimeout } from 'timers/promises';

const app = express();
export const server = http.createServer(app);
const port = process.env.PORT || 8000;

/* Middleware */
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Routing */
app.use('/api/upload', authMiddleware, uploadRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/user',authMiddleware,userRouter);
app.use('/api/graph', authMiddleware, graphRouter);
app.use('/api/cards', cardRouter);
app.use('/api/social', socialRouter);
app.use('/dashboard', searchRouter);
app.use('/api/myinfo', authMiddleware, mypageRouter);

app.use('/api/tag', authMiddleware, tagRouter);
app.use('/api/dummy', dummyRouter);
app.use('/api/notification',authMiddleware,notificationRouter);


/* NGINX test */
app.get('/hello', async (req, res) => {
  res.write('hello');
  await setTimeout(500);
  res.write('world');
  res.end();
});


/* session management */
app.get('/api/users/me', authMiddleware, async (req, res) => {
  const { user } = res.locals
  console.log('현재 로그인한 유저의 local 정보 : ')
  console.log(user)
  res.send({
    user,
  });
});

/* Server */
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
