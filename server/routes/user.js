import express from 'express';
import '../dotenv.js';
import { db } from '../connect.js';
import { userInfoQuery , userProfileQuery } from '../db/userQueries.js';


const router = express.Router();

router.get('/', async (req, res) => {
  const { user } = res.locals;
  const userId = user.user_id;
  let connection = null;
  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(userInfoQuery(userId));
    const cnt_query = `select COUNT(*) AS cnt from Follow where user_id = ${userId}`;
    const cnt = await connection.query(cnt_query);
    const { userName , tagCnt, cardCnt } = result[0];
    
    let val = parseInt(tagCnt) / 2;
    let updatedTagCnt = val | 0;
    const data = {
      userName,
      tagCnt : updatedTagCnt,
      cardCnt: parseInt(cardCnt),
      followCnt: cnt[0][0]['cnt'], 
    };
    //console.log('tagCnt :',parseInt(tagCnt));
    console.log('data : ',data);
    connection.release();
    return res.status(200).send(data);
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:other_id', async (req, res) => {
  //const { user } = res.locals;
  //const userId = user.user_id;
  const otherId = req.params.other_id;

  console.log('otherId : ',otherId);
  let connection = null;
  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(userInfoQuery(otherId));
    const cnt_query = `select COUNT(*) AS cnt from Follow where user_id = ${otherId}`;
    const cnt = await connection.query(cnt_query);

    console.log('result[0] : ',result[0]);
    const { userName , tagCnt, cardCnt } = result[0];
    let val = parseInt(tagCnt) / 2;
    let updatedTagCnt = val | 0;
    console.log('tagCnt : ',tagCnt);
    const data = {
      userName,
      tagCnt : updatedTagCnt,
      cardCnt: parseInt(cardCnt),
      followCnt: cnt[0][0]['cnt'], 
    };
    //console.log('tagCnt :',parseInt(tagCnt));
    console.log('data : ',data);
    connection.release();
    return res.status(200).send(data);
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/profile', async (req, res) => {
  const { user } = res.locals;
  const userId = user.user_id;
  let connection = null;
  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(userProfileQuery(userId));
        
    if (result.length === 0) {
      return res.status(404).send('User profile not found');
    }
    const { profile_img } = result[0];
    const data = {
      userProfile : profile_img,
    };
    console.log(profile_img);
    connection.release();
    return res.status(200).send(data);
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
    
});



export default router;