import express from 'express';
import '../dotenv.js';
import { db } from '../connect.js';
import { searchContent , searchTag} from '../db/searchQueries.js';

const router = express.Router();

router.get('/contents', async (req, res) => {
  // console.log(req.query);
  const { search } = req.query;

  let connection = null;

  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(searchContent(search));

    let arr = [];
    for (let i = 0; i < result.length / 2; i++) {
      arr.push({
        cardTags: [result[i * 2].tag, result[i + 1].tag],
        cardKeyword: '# 1',
        cardContent: result[i * 2].content,
      });
    }
    console.log("내용 수 :", arr.length);

    return res.send({
      results: [arr[0]],
      cnt : arr.length,
    });
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tags', async (req, res) => {
  // console.log(req.query);
  const { search } = req.query;
  console.log(req.query);

  let connection = null;

  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(searchTag(search));

    let arr = [];
    for (let i = 0; i < result.length / 2; i++) {
      arr.push({
        cardTags: [result[i * 2].tag, result[i + 1].tag],
        cardKeyword: '# 1',
        cardContent: result[i * 2].content,
      });
    }
    console.log("태그 수 :", arr.length);

    return res.send({
      results: [arr[0]],
      cnt : arr.length,
    });
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/contents/all', async (req, res) => {
  // console.log(req.query);
  const { search, page, perPage } = req.query;

  let connection = null;

  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(searchContent(search));
    // console.log("result 갯수 : " + result.length);

    let arr = [];
    for (let i = 0; i < Math.floor(result.length / 2); i++) {
      arr.push({
        cardTags: [result[i * 2].tag, result[i * 2 + 1].tag],
        cardKeyword: `# ${i+1}`,
        cardContent: result[i * 2].content,
      });
    }
    
    console.log("arr길이 " + arr.length);

    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const slicedResults = arr.slice(startIndex, endIndex);
    
    console.log("SI: " + startIndex +",EI: " + endIndex);
    // console.log(slicedResults);

    return res.send({
      results: slicedResults,
      totalResults :  arr.length,
      totalPages: Math.ceil(arr.length / perPage),
      hasNextPage: endIndex < arr.length,
    });
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tags/all', async (req, res) => {
  // console.log(req.query);
  const { search, page, perPage } = req.query;

  let connection = null;

  try {
    connection = await db.getConnection();
    const [ result ] = await connection.query(searchTag(search));
    // console.log("result 갯수 : " + result.length);

    let arr = [];
    for (let i = 0; i < Math.floor(result.length / 2); i++) {
      arr.push({
        cardTags: [result[i * 2].tag, result[i * 2 + 1].tag],
        cardKeyword: `# ${i+1}`,
        cardContent: result[i * 2].content,
      });
    }
    
    console.log("arr길이 " + arr.length);

    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const slicedResults = arr.slice(startIndex, endIndex);
    
    console.log("SI: " + startIndex +",EI: " + endIndex);
    // console.log(slicedResults);

    return res.send({
      results: slicedResults,
      totalResults :  arr.length,
      totalPages: Math.ceil(arr.length / perPage),
      hasNextPage: endIndex < arr.length,
    });
  } catch(err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;