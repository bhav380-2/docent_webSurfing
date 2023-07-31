const Blogs = require('../models/blogs');



module.exports.blog= async function (req, res) {
    console.log("blog loaded");


    const blogs = await Blogs.find({}).populate("createdBy");

    return res.render('blog', {
        Title: "blog page", 
        Blogs : blogs  
    });
}


module.exports.createBlog = async function(req,res){

    if(!req.isAuthenticated()){
        return res.redirect('/');
    }

    console.log("create-blog controller loaded");
    console.log(req.body);
    console.log(req.file);

    try{

        const {title,content} = req.body;
        


        await Blogs.create({
            title : title,
            body : content,
            coverImageUrl : `/uploads/${req.file.filename}`,
            createdBy : req.user._id
        });
    
      
    
        return res.json(200,{
            message : "Blog Created successfully",
           
        });
    

    }catch(err){
        console.log('Error in create Blog controller : ',err);
        return res.json(500,{
            message :"Internal server error"
        });
    }

}

module.exports.blogContent = async function(req,res){

    try{
        const blog = await Blogs.findById(req.params.id).populate("createdBy");
        console.log(blog);

        return res.render('blogContent',{
            Title : ""+blog.title,
            Blog : blog
        })



    }catch(err){
        console.log("Error in blog content controller : ",err);
        return;
    }
}


module.exports.delete = async function(req,res){
    
    try{


        const blog = Blogs.findById(req.params.id);

        if(req.user.id != blog.createdBy){
            console.log('user not authenticated to delete this blog ....');
            res.redirect('/blog');
        }

        await Blogs.findByIdAndDelete(req.params.id)
 

      

        return res.redirect('back');

    }catch(err){
        console.log("Error in delete blog controller , ::: ",err);
    }
}