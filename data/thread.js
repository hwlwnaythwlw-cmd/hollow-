const mongoose = require('mongoose');
const log = require('../logger');


const groupSchema = new mongoose.Schema({
  id: String,
  name: String,
  img: String,
  messageCount: { type: Number, default: 0 },
  members: { type: Array, default: [] },
  admins: { type: Array, default: [] },
  status: { type: Boolean, default: false },
  
});

// نموذج المجموعة
const Group = mongoose.model('Group', groupSchema);


async function saveGroup(newGroup) {
  try {
    const exists = await Group.findOne({ id: newGroup.id });
    if (exists) {
      log.warn(`Group with ID ${newGroup.id} already exists.`);
      return exists;
    }
    const group = new Group(newGroup);
    await group.save();
    log.info(`New group saved successfully with ID ${newGroup.id}`);
    return group;
  } catch (error) {
    log.error(`Error saving new group with ID ${newGroup.id}:` + error);
    throw error;
  }
}


async function getGroup(id) {
  try {
    const group = await Group.findOne({ id })
    if (!group) {
      log.warn(`Group with ID ${id} not found`);
      return null
    }
    return group;
  } catch (error) {
    log.error(`Error fetching group data for ID ${id}:` + error);
    return null;
  }
}


async function deleteGroup(id) {
  try {
    const deletedGroup = await Group.findOneAndDelete({ id });
    if (!deletedGroup) {
      throw new Error(`Group with ID ${id} not found`);
    }
    log.info(`Group with ID ${id} deleted successfully`);
  } catch (error) {
    log.error(`Error deleting group with ID ${id}:` + error);
    throw error;
  }
}



async function updateGroup(id, updatedData) {
  try {
    const group = await Group.findOneAndUpdate({ id }, updatedData, { new: true });
    if (!group) {
      throw new Error(`Group with ID ${id} not found`);
    }
    log.info(`Group with ID ${id} updated successfully`);
    return group;
  } catch (error) {
    log.error(`Error updating group with ID ${id}:` + error);
    throw error;
  }
}



async function getAllGroups() {
  try {
    const groups = await Group.find();
    return groups;
  } catch (error) {
    log.error('Error fetching all Groups: ' + error);
    throw error;
  }
}



module.exports = {
  saveGroup,
  getGroup,
  deleteGroup,
  updateGroup,
  getAllGroups
}
