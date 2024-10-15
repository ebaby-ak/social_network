const { User, Thought } = require("../models");

const userController = {
  // get all users
  async getUsers(req, res) {
    try {
      const userData = await User.find();

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get single user by id
  async getUserById(req, res) {
    try {
      const userData = await User.findById(req.params.userId)
        .populate("friends")
        .populate("thoughts");

      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user
  async updateUser(req, res) {
    try {
      const userData = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });

      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete user (BONUS: and delete associated thoughts)
  async deleteUser(req, res) {
    try {
      const userData = await User.findByIdAndDelete(req.params.userId);

      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      // BONUS: get ids of user's `thoughts` and delete them all
      await Thought.deleteMany({ _id: { $in: userData.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add friend to friend list
  async addFriend(req, res) {
    try {
      const userData = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
