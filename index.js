const { randomUUID } = require('crypto');
const express = require('express');
const dataUriToBufer = (...args) => import('data-uri-to-buffer').then(( d ) => d.default(...args)); // i'll fix this hell later
const fs = require('fs');
const app = express();

// Yes i realise that it is extremely insecure. Trying to find a way to make it more secure without throwing discord tokens around, or having another account thingy

if(!fs.existsSync('images'))
    fs.mkdirSync('images');

if(!fs.existsSync('config'))
    fs.mkdirSync('config');

app.post('/api/v1/banner', ( req, res ) => {
    res.header('Access-Control-Allow-Origin', '*');
    let userID = req.query.id;

    if(!userID)
        return res.send({ ok: false, error: "No UserID In Request." });

    let data = '';
    req.on('data', chunk => data += chunk.toString());

    req.on('end', async () => {
        try{
            data = JSON.parse(data);

            let format = data.name.split('.').pop();
            let imageID = randomUUID();

            if(!fs.existsSync('images/'+userID))
                fs.mkdirSync('images/'+userID);

            fs.writeFileSync('config/'+userID+'.json', JSON.stringify({
                "banner_url": "/cdn/"+userID+"/"+imageID+"."+format,
                "id": userID,
                "background_colour": null,
                "foreground_colour": null,
                "has_shadow": false,
                "ok": true
            }))

            let buff = await dataUriToBufer(data.file);
            fs.writeFileSync('images/'+userID+'/'+imageID+'.'+format, buff);

            res.send({ ok: true });
        } catch(e){
            res.send({ ok: false, error: "Invaild Data" });
        }
    })

    req.on('error', () => {
        res.send({ ok: false, error: "500 Interval Server Error" });
    })
})

app.post('/api/v1/profile', ( req, res ) => {
    res.header('Access-Control-Allow-Origin', '*');
    let userID = req.query.id;

    if(!userID)
        return res.send({ ok: false, error: "No UserID In Request." });

    let data = '';
    req.on('data', chunk => data += chunk.toString());

    req.on('end', async () => {
        try{
            data = JSON.parse(data);

            let userConfig = JSON.parse(fs.readFileSync("config/"+userID+".json").toString());
            userConfig.banner_url = null;

            if(data.background_colour)userConfig.background_colour = data.background_colour;
            if(data.foreground_colour)userConfig.foreground_colour = data.foreground_colour;
            if(data.has_shadow)userConfig.has_shadow = data.has_shadow;

            fs.writeFileSync("config/"+userID+".json", JSON.stringify(userConfig));
            res.send({ ok: true });
        } catch(e){
            res.send({ ok: false, error: "Invaild Data" });
        }
    })

    req.on('error', () => {
        res.send({ ok: false, error: "500 Interval Server Error" });
    })
})

app.get('/api/v1/profile', ( req, res ) => {
    res.header('Access-Control-Allow-Origin', '*');
    let userID = req.query.id;

    if(!userID)
        return res.send({ ok: false, error: "No UserID In Request." });

    if(!fs.existsSync("config/"+userID+".json"))
        return res.send({ ok: false, error: "404 User not found" });

    res.sendFile(__dirname + "/config/"+userID+".json");
})

app.get('/cdn/:userID/:imageID', (req, res) => {
    if(!req.params.userID || !req.params.imageID)return res.send({ ok: false });

    if(!fs.existsSync(__dirname + '/images/'+req.params.userID+'/'+req.params.imageID))
        return res.send({ ok: false, error: "404 Image not found" })

    res.sendFile(__dirname + '/images/'+req.params.userID+'/'+req.params.imageID);
})

app.delete('/api/v1/banner', ( req, res ) => {
    res.header('Access-Control-Allow-Origin', '*');
    let userID = req.query.id;

    if(!userID)
        return res.send({ ok: false, error: "No UserID In Request." });

    if(!fs.existsSync("config/"+userID+".json"))
        return res.send({ ok: false, error: "404 User not found" });

    let userConfig = JSON.parse(fs.readFileSync("config/"+userID+".json").toString());
    userConfig.banner_url = null;

    fs.writeFileSync("config/"+userID+".json", JSON.stringify(userConfig));
    res.send({ ok: true });
})

app.listen(8090);