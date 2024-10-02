import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req,res)=>{

    try{

        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId]}
        })

        if(!conversation)
        {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if(newMessage)
        {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);
        console.log("Message Sent ",req.params.id);
    }catch(error)
    {
        console.log("Erro in sendMessage Controller ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
    
}

export const getMessages =  async (req,res) =>
{
    try{
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all : [senderId,receiverId]},
        }).populate("messages");

        if(!conversation)
        {
            return res.status(200).json([]); //if no conversations
        }

        const messages = conversation.messages.map(msg => msg.message);
        console.log(conversation);
        res.status(200).json(messages);
    }catch(err)
    {
        console.log("Error in getMessages controller : ", err.message);
        res.status(500).json({error: "Internal Server Error "});
    }
}