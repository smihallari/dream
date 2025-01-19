const Post = require('../models/post');
const sharp = require('sharp');
const axios = require('axios');

const enterContest = async(req, res) => {
    try{
        const{ title, category, content, imageUrl} = req.body;
        const author = req.user.id;
        let imageBuffer = null;
        let isInContest = true;

        if(req.file){
            //Handling uploaded file
            imageBuffer = await sharp(req.file.buffer)
            .resize(300,300)
            .jpeg({ quality: 80 })
            .toBuffer();
        } else if (imageUrl){
            try{
                //Handling image url 
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer'});
                imageBuffer = await sharp(response.data)
                .resize(300, 300)
                .jpeg({ quality: 80})
                .toBuffer();
            }catch (err) {
                console.error('Failed to download image from URL:', err.message);
                return res.status(400).json({ error: 'Invalid image URL' });
            }
        }
        
        const newContestPost = new Post({
            author, 
            title, 
            category, 
            content, 
            image: imageBuffer, 
            isInContest,

        });

        await newContestPost.save();

        res.status(201).json({
            message: 'Contest post created succesfully', 
            post: {
                id: newContestPost._id,
                author: newContestPost.author,
                title: newContestPost.title,
                content: newContestPost.content,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Failed to create new contest post');
    }
};

module.exports = {enterContest};