const { Thought, User } = require("../models");

const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      res.json(thoughts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get single thought by id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(
        req.params.id
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      } else {
        res.json(thought);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      } catch (err) {
      res.status(500).json(err);
    }
  },

  // update thought
  async updateThought(req, res) {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId, req.body, { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with this id!" });
    } else {
      res.json(thought);
    }
    } catch (err) {
    res.status(500).json(err);
    }
  },

  // delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndRemove(
        req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      // remove thought id from user's `thoughts` field
      const dbUserData = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Thought created but no user with this id!" });
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
