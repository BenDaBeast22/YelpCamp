const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Clouds Rest", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F7XJ2aKsjIgY%2Fmaxresdefault.jpg&f=1&nofb=1", description: "This is the clouds rest"
    },
    {
        name: "Nice Scenery", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Firena.org%2F-%2Fmedia%2FImages%2FIRENA%2FAgency%2FArticle%2F2018%2FApr%2FVolcano-sunset-in-Indonesia.jpg&f=1&nofb=1", description: "Wow look at this beautiful view"
    },
    {
        name: "Water 7", image: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimg1.wikia.nocookie.net%2F__cb20141213204311%2Fonepiece%2Fimages%2F9%2F93%2FWater_7_Infobox.png&f=1&nofb=1", description: "A village that is half underwater and uses rivers to traverse instead of roads. This village is very simalar to villages in Italy such as vienna and the villagers worship the water god poseidon. Coming on a trip is the best because it is such a cool destination. Right now I am practicing typing because I type quite slowly and I have to get better so that I can become the very best and win it all. Now that I am finished hopefully this is a decent amount of text."
    },
    {
        name: "Heavens Arena", image: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages5.fanpop.com%2Fimage%2Fphotos%2F30500000%2FHeaven-s-Arena-hunter-x-hunter-30544756-923-538.jpg&f=1&nofb=1", description: "The battle arena of nen users to decide who is the best!!!"
    }
]

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campgrounds!");
        //Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Added a campground");
                    //Create a comment
                    Comment.create({
                        text: "This place is great! Tabeyo",
                        author: "Naruto"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });

    //Add a few comments
}

module.exports = seedDB;
