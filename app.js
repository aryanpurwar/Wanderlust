const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main()
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res)=>{
    res.redirect("/listings");
});

//Index Route
app.get("/listings", async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("D:/apnaCollegeSigma/WebDevelopment/Projects/Project-airbnb-FullStack/WanderLust/views/listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res)=>{
    res.render("D:/apnaCollegeSigma/WebDevelopment/Projects/Project-airbnb-FullStack/WanderLust/views/listings/new.ejs");
})

//Show Route
app.get("/listings/:id", async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("D:/apnaCollegeSigma/WebDevelopment/Projects/Project-airbnb-FullStack/WanderLust/views/listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async(req, res)=>{
    // let { title, description, image, price, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit", async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("D:/apnaCollegeSigma/WebDevelopment/Projects/Project-airbnb-FullStack/WanderLust/views/listings/edit.ejs", { listing });
})


//Update Route
app.put("/listings/:id", async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testListing", async(req, res)=>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing
//         .save();
//     console.log("Sample was saved");
//     res.send("Successful Testing");
// });

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});