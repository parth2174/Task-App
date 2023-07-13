import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());

app.get('/',(req,res) => {
    res.send("Welcome to Express")
})

// mongoose
//   .connect('mongodb://localhost/todo-list', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.log('Failed to connect to MongoDB', error);
//   });


const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
  };

  connect();
  
  mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });

  app.use(cors())
  app.use(cookieParser())
  app.use(express.json());


const itemSchema = new mongoose.Schema({
  value: String,
});

const Tasks = mongoose.model('Tasks', itemSchema);

app.get('/api/tasks', async (req, res) => {
  try {
    const items = await Tasks.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newItem = new Tasks(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const updatedItem = await Tasks.findByIdAndUpdate(id, { value }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Tasks.findByIdAndRemove(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
