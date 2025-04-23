import dotenv from "dotenv"
import express from "express"

const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config();

app.get('/', (req, res) => {
    res.send("home")
})

const start = () => {
    try {
        app.listen(PORT, (req, res) => {
            res.send(`Server is running at ${PORT}`)
        })
    } catch (error) {
        console.log(error);
        
    }
}

