const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const storySchema=new Schema({
    title:{
        type:String,
        required:true
    },
    coverImgUrl:{
        type:String
    },
    content:{
        pages:[
            {
                pageContent:{type:String,required:true},
                pageImgUrl:{type:String}
            }
        ]
    }

})

module.exports=mongoose.model('Story',storySchema);