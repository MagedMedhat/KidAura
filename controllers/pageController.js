const Story = require("../models/storyModel");

exports.getAuthPage = (req, res, next) => {
  res.render("auth", {
    pageTitle: "Welcome to Kidora",
  });
};

exports.getLibraryPage = (req, res, next) => {
  // Get ALL stories from model and pass to template
  Story.find().then(stories=>{
    res.render("library", {
      pageTitle: "Story Library",
      stories: stories, // Pass stories directly to template
    });

  });

};

exports.getReaderPage = (req, res, next) => {
  const storyId = req.params.storyId;

  // Validate story ID
  if (!storyId || isNaN(parseInt(storyId))) {
    return res.redirect("/library");
  }

  // Get specific story from model
  Story.findById(storyId).then(story=>{
    if (!story) {
      return res.redirect("/library");
    }
  
    res.render("reader", {
      pageTitle: story.title,
      story: story, // Pass the entire story to template
    });

  });

};

exports.getAddStory = (req, res, next) => {
    res.render('add-story', {
        pageTitle: 'Add New Story',
    });
};

exports.postAddStory=(req,res,next)=>{
  const title=req.body.title;
  const coverUrl=req.body.coverImgUrl
  const storyData={
    title:title.trim(),
    coverImgUrl:coverUrl,
    content:{
      pages:[]
    }
  }

  let pageNumber=1;
  while(true){
    const pageContent=req.body[`pageContent${pageNumber}`];
    if(!pageContent)break;
    const trimmedContent=pageContent.trim();
    if(trimmedContent){
      storyData.content.pages.push({
        pageContent:trimmedContent,
        pageImgUrl:req.body[`pageImage${pageNumber}`]
      })
    }
    pageNumber++;
    if (pageNumber > 20) break;
  }
  const story=new Story(storyData);
  story.save().then(result=>{
    console.log("Created Story")
    res.redirect("/library");
  }).catch(err=>{
    console.log(err);
  })
}