import express from "express";
import User from "../models/user.model.js";

export const getUsers = async (req,res) =>
{
    try{
        const userId = req.user._id;

        const user = User.findById(userId).populate('contacts');

        if(!user)
        {
            console.log("User Not Found !!");
            res.status(404).json({error : "User Not Found"});
        }

        console.log(user);

        const contacts = Array.isArray(user.contacts) ? user.contacts : [];

        res.status(200).json({contacts : contacts});
    }catch(error)
    {
        console.log("Error in Get Users in side bar Controller !! ",error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}

export const addUser = async(req,res) =>
{
    try{
        const userId = req.user._id;
        const { contactId } = req.body;

        const contact = await User.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        const user = await User.findById(userId);

        // Check if the contact is already in the user's contacts array
        if (user.contacts.includes(contactId)) {
            return res.status(400).json({ error: "Contact already exists in your contacts" });
        }

        // Add the contact to the user's contacts array
        user.contacts.push(contactId);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Contact added successfully", contacts: User.contacts });
    }catch(error)
    {
        console.log("Error in AddUser controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}