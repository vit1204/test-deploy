const connections = require("../databases/connection");
const knex = require("../databases/knex");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const createPolls = async (req, res) => {
  const { voteTitle, Question, options } = req.body;
  const poll = {
    voteTitle,
    Question,
    createdAt: new Date(Date.now()),
  };

  await connections.query("SET GLOBAL FOREIGN_KEY_CHECKS=0;");

  await knex.insert(poll).into("pools").then((response) => {
    connections.query("SELECT LAST_INSERT_ID();");
    const PollId = response[0];
    console.log(PollId, response);
    const optionsData = options.map((option) => {
      return {
        voteOption: option.voteOption,
        Poll_ID: PollId,
      };
    });
    console.log(optionsData);
    connections.query("SET GLOBAL FOREIGN_KEY_CHECKS=1;");

    return knex.insert(optionsData).into("options");
  })
    .then(() => {
      res.status(200).json({ message: "Poll added" });
    }).catch((err) => {
      console.log(err);
      res.status(404).json({ message: "failed to add poll" });
    });
};

const updatePolls = async (req, res) => {
  const id = req.params.id;
  const poll = {
    voteTitle: req.body.voteTitle,
    Question: req.body.Question,
  };
  try {
    const existingPoll = await knex("pools").where("PollId", id).first();
    if (!existingPoll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    await knex("pools").where("PollId", id).update(poll);

    res.status(200).json({ message: "Poll updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePolls = async (req, res) => {
  try {
    const pollId = req.params.id;
    const existingPoll = await knex("pools").where("PollId", pollId).first();
    if (!existingPoll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }
    await knex("options").where("Poll_ID", pollId).del();
    await knex("pools").where("PollId", pollId).del();

    return res.status(200).json({
      message: "Poll deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getPolls = async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = await knex("pools").where("PollId", pollId).first();
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }
    const options = await knex("options").where("Poll_ID", pollId);
    const pollDetails = {
      PollId: poll.PollId,
      voteTitle: poll.voteTitle,
      Question: poll.Question,
      CreatedAt: poll.CreatedAt,
      options: options.map((option) => ({
        options_id: option.options_id,
        voteOption: option.voteOption,
      })),
    };

    return res.status(200).json(pollDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateOptions = async (req, res) => {
  try {
    const optionId = req.params.optionId;
    const { voteOption } = req.body;
    const existingOption = await knex("options").where("option_id", optionId)
      .first();
    if (!existingOption) {
      return res.status(404).json({
        message: "Option not found",
      });
    }
    await knex("options").where("option_id", optionId).update({
      voteOption,
    });
    return res.status(200).json({
      message: "Option updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const submitOtions = async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const optionId = req.params.optionId;
    const userId = req.params.userId;

    await connections.query("SET GLOBAL FOREIGN_KEY_CHECKS=0;");

    const user = await knex("users").where("id", userId).first();
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const poll = await knex("pools").where("PollId", pollId).first();
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }
    const option = await knex("options").where("Poll_ID", optionId).first();
    if (!option) {
      return res.status(404).json({
        message: "Option not found",
      });
    }
    await connections.query("SET GLOBAL FOREIGN_KEY_CHECKS=1;");

    const userData = await knex("UserOption").insert({
      UserID: userId,
      PollID: pollId,
      OptionID: optionId,
    });

    return res.status(200).json({
      message: "Option submitted successfully",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// router.post("/polls/:pollId/options/:optionId/unsubmit", async (req, res) => {
//   try {
//     const pollId = req.params.pollId;
//     const optionId = req.params.optionId;
//     const poll = await knex("polls").where("id", pollId).first();
//     if (!poll) {
//       return res.status(404).json({
//         message: "Poll not found",
//       });
//     }
//     const option = await knex("options").where("id", optionId).first();
//     if (!option) {
//       return res.status(404).json({
//         message: "Option not found",
//       });
//     }
//     if (option.count > 0) {
//       await knex("options")
//         .where("id", optionId)
//         .decrement("count", 1);
//     }

//     return res.status(200).json({
//       message: "Option unsubmitted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// });

module.exports = {
  createPolls,
  updatePolls,
  deletePolls,
  getPolls,
  updateOptions,
  submitOtions,
};
