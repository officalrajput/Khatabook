const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

  

// Function to generate a unique filename if one already exists
function generateUniqueFilename(directory, filename, extension, counter = 0) {
    const baseName = `${filename}${counter ? `_${counter}` : ''}${extension}`;
    const filePath = path.join(directory, baseName);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
        // If it exists, increment the counter and try again
        return generateUniqueFilename(directory, filename, extension, counter + 1);
    } else {
        return baseName; // Return the unique filename
    }
}




//For Read hissab Folder render on Home page total file
app.get('/',function(req,res,next){
    fs.readdir(`./hissab`,function(err,files){
       if(err) return res.status(500).send(err)
       else res.render('index',{files:files});
    })
})

//For Creating File Name With date.txt 
app.get('/create',function(req,res,next){
 res.render("create");
})

// //For create Hissab File
// app.post(`/createhissab`,function(req,res){

//     const currentDate = new Date();
//     const day = String(currentDate.getDate()).padStart(2, '0');  
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
//     const year = currentDate.getFullYear();
    
//     const fn = `${day}-${month}-${year}.txt`;

//     fs.writeFile(`./hissab/${fn}`,req.body.content,function(err){
//         if(err) return res.status(500).send(err);
//         else res.redirect('/');
//     })
// })

app.post('/createhissab', function(req, res) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');  
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const year = currentDate.getFullYear();

    const directory = './hissab'; // Directory where files are stored
    const baseFilename = `${day}-${month}-${year}`; // Base filename (e.g., "23-09-2024")
    const extension = '.txt';

    // Generate a unique filename if a file with the same name exists
    const uniqueFilename = generateUniqueFilename(directory, baseFilename, extension);

    // Write the file with the unique filename
    fs.writeFile(path.join(directory, uniqueFilename), req.body.content, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        // Redirect to the homepage after successful file creation
        res.redirect('/');
    });
});

//For Edit the File 
app.get("/edit/:filename",function(req,res){
    fs.readFile(`./hissab/${req.params.filename}`,'utf-8',function(err,data){
        if(err) return res.status(500).send(err);
        else res.render('edit',{data,filename:req.params.filename})
    })
})

//FOr Update the file
app.post("/update/:filename",function(req,res){
    fs.writeFile(`./hissab/${req.params.filename}`,req.body.content,function(err){
     if(err) return res.status(500).send(err);
     else res.redirect('/');
    })
})

//For Show hissab
app.get("/showhissab/:filename",function(req,res){
    fs.readFile(`./hissab/${req.params.filename}`,'utf-8',function(err,showhissab){
        if(err) return res.status(500).send(err);
        else res.render('show',{showhissab,filename:req.params.filename});
    })
})

//Delete hissab
app.get("/delete/:filename",function(req,res){
    fs.unlink(`./hissab/${req.params.filename}`,function(err){
        if(err) return res.status(500).send(err);
        else res.redirect('/')
    })
})

app.listen(4848)