const { nodeMailer } = require("../helpers/index");

const userController = {
  async sendMail(req, res) {
    try {
      let data = req.body;
      await nodeMailer(
        `<html>
        <div>
        <span>${data.fullname}</span> <br/>
        <span>${data.email}</span> <br/>
        <span>${data.phone}</span> <br/>
        <span>${data.message}</span> <br/>
        </div>
        </html>`
      );
      res
        .status(201)
        .json({
          message:
            "Thank you for contacting me, I will get back to you shortly",
        });
    } catch ({ message }) {
      res.status(401).json({ message });
    }
  },
};

module.exports = userController;
