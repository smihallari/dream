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
            
            imageBuffer = await sharp(req.file.buffer)
            .resize(300,300)
            .jpeg({ quality: 80 })
            .toBuffer();
        } else if (imageUrl){
            try{
                
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer'});
                imageBuffer = await sharp(response.data)
                .resize(300, 300)
                .jpeg({ quality: 80})
                .toBuffer();
            }catch (error) {
                error.message = 'Invalid image url';
                error.status = 400;
                next(error);
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
        error.message = 'Failed to create new contest post';
                error.status = 500;
                next(error);
    }
};

module.exports = {enterContest};