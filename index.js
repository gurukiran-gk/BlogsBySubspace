const express = require('express');
const axios = require('axios');
const app = express();
const lodash = require('lodash');
const port = 3000;

app.listen(port, () => 
{
  console.log(`Server is running on port ${port}`);
});

const options = 
{
  method: 'GET',
  headers: {'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6' },
  url: 'https://intent-kit-16.hasura.app/api/rest/blogs',
};

async function fetchBlogData(req, res, next) 
{
  try {
    const response = await axios(options);
    const blogData = response.data;
    req.blogData = blogData;
    next();
  } 
  catch (error) 
  {
    console.error('Error fetching blog data:', error);
    next(error);
  }
}

app.use('/api/blog-data', fetchBlogData);
app.use('/api/NoOfBlogs', fetchBlogData);
app.use('/api/LongestBlogTitle', fetchBlogData);
app.use('/api/BlogWithKeyPrivacy', fetchBlogData);
app.use('/api/uniqueTitles', fetchBlogData);
app.use('/api/blog-search', fetchBlogData);

app.get('/api/blog-data', (req, res) => 
{
  const blogData = req.blogData;
  res.json(blogData);
});

app.get('/api/NoOfBlogs', (req, res) => 
{
  const blogData = req.blogData;
  const numberOfBlogs = lodash.get(blogData, 'blogs.length', 0);
  console.log(`Number of blogs: ${numberOfBlogs}`);
  res.send(`<h1>No Of Blogs : ${numberOfBlogs}</h1>`);
});

app.get('/api/LongestBlogTitle', (req, res) => 
{
  const blogData = req.blogData;
  const LongestBlogTitle = lodash.maxBy(blogData.blogs, (blog) => blog.title.length);
  console.log(`LongestBlogTitle: ${LongestBlogTitle.title}`);
  const foundObject = blogData.blogs.find((obj) => obj.title === LongestBlogTitle.title);

  if (foundObject) {
    console.log("Found object:", foundObject);
  } else {
    console.log(`No object with ID ${targetId} found.`);
  }
  const jsonString = JSON.stringify(foundObject, null, 2);
  res.send(`<h3>LongestBlogTitle : ${LongestBlogTitle.title}<br><br>Object in json is  : ${jsonString}</h3>`);
 
});

app.get('/api/BlogWithKeyPrivacy', (req,res) => 
{
  const keyword = "privacy";
  const blogData = req.blogData;
  const filteredBlogs = blogData.blogs.filter((obj) => obj.title.toLowerCase().includes(keyword.toLowerCase())
);
for (const title in filteredBlogs) {
  console.log(title, filteredBlogs[title]);
}; 
const numberOfBlogsWithPrivacy = filteredBlogs.length;
const jsonString = JSON.stringify(filteredBlogs, null, 2);
res.send(`<h3>Number of blogs with "privacy" in the title: : ${numberOfBlogsWithPrivacy}<br><br>Object in json is  : ${jsonString}</h3>`);
console.log(`Number of blogs with "privacy" in the title: ${numberOfBlogsWithPrivacy}`);
})

app.get('/api/uniqueTitles', (req, res) => 
{
  const blogData = req.blogData;
  const uniqueTitles = lodash.uniqBy(blogData.blogs, 'title').map(blog => blog.title);
  console.log(uniqueTitles);
  res.send(uniqueTitles);
});

app.get('/api/blog-search', (req, res) => 
{
  const blogData = req.blogData;
  const query = req.query.query;
  if (!query) 
  {
    return res.status(400).json({ error: 'Query parameter "query" is missing.' });
  }

  const filteredBlogs = blogData.blogs.filter((blog) => blog.title.toLowerCase().includes(query.toLowerCase()));
  console.log(filteredBlogs);
  res.json(filteredBlogs);
});
