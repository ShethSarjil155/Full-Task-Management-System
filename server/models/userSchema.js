// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { json } = require("express");

// const Skey = "soelshaikhshaikhsoelshaikhsoelab";

// const userSchema = new mongoose.Schema({
//   fname: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("Not Valid Email");
//       }
//     },
//   },

//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   cpassword: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   tokens: [
//     {
//       token: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   dateCreated: {
//     type: Date,
//     default: Date.now,
//   },
// });

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 12);
//     this.cpassword = await bcrypt.hash(this.cpassword, 12);
//   }
//   next();
// });

// userSchema.methods.generateAuthtoken = async function () {
//   try {
//     let token1 = jwt.sign({ _id: this._id }, Skey, {
//       expiresIn: "1d",
//     });

//     this.tokens = this.tokens.concat({ token: token1 });
//     await this.save();
//     return token1;
//   } catch (error) {
//     res.status(422).json(error);
//   }
// };

// const userdb = new mongoose.model("noteusers", userSchema);

// module.exports = userdb;

/* previous */

// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const Skey = "soelshaikhshaikhsoelshaikhsoelab";

// const userSchema = new mongoose.Schema(
//   {
//     fname: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       trim: true,
//       default: "user",
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       validate(value) {
//         if (!validator.isEmail(value)) {
//           throw new Error("Not a valid email");
//         }
//       },
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     cpassword: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     isBlocked: {
//       type: String,
//       required: true,
//       default: "n",
//     },
//     tokens: [
//       {
//         token: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     dateCreated: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 12);
//     this.cpassword = await bcrypt.hash(this.cpassword, 12);
//   }
//   next();
// });

// userSchema.methods.generateAuthToken = async function () {
//   try {
//     const token = jwt.sign({ _id: this._id }, Skey, { expiresIn: "1d" });
//     this.tokens = this.tokens.concat({ token });
//     await this.save();
//     return token;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const User = mongoose.model("User", userSchema);

// module.exports = User;

// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const Skey = "soelshaikhshaikhsoelshaikhsoelab";

// const userSchema = new mongoose.Schema(
//   {
//     fname: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       trim: true,
//       default: "user",
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       validate(value) {
//         if (!validator.isEmail(value)) {
//           throw new Error("Not a valid email");
//         }
//       },
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     cpassword: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     isBlocked: {
//       type: String,
//       required: true,
//       default: "n",
//     },
//     tokens: [
//       {
//         token: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     team: {
//       type: String,
//       enum: ["VideoEditing", "Design", "SEO", "DigitalMarketing", "Developing"],
//       required: false,
//     },
//     secretKey: {
//       type: String,
//       function() {
//         return this.isTeamLeader;
//       },
//     },
//     isTeamLeader: {
//       type: Boolean,
//       default: false,
//     },
//     teamLeaderAlert: { type: Boolean, default: false },
//     dateCreated: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 12);
//     this.cpassword = await bcrypt.hash(this.cpassword, 12);
//   }
//   next();
// });

// userSchema.methods.generateAuthToken = async function () {
//   try {
//     const token = jwt.sign({ _id: this._id }, Skey, { expiresIn: "1d" });
//     this.tokens = this.tokens.concat({ token });
//     await this.save();
//     return token;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Skey = "soelshaikhshaikhsoelshaikhsoelab";

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    cpassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    isBlocked: {
      type: String,
      required: true,
      default: "n",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    team: {
      type: String,
      enum: [
        "VFX",
        "Design",
        "PhotoShop",
        "UI/UX",
        "Developing",
        "Social Media",
        "Digital Marketing",
      ],
      required: false,
    },
    secretKey: {
      type: String,
      function() {
        return this.isTeamLeader;
      },
    },
    isTeamLeader: {
      type: Boolean,
      default: false,
    },
    teamLeaderAlert: { type: Boolean, default: false },
    // Client Coordinator Fields
    isClientCoordinator: {
      type: Boolean,
      default: false,
    },
    clientCoordinatorAlert: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    designation: {
      type: String,
      enum: [
        "TL",
        "Client Coordinator",
        "Designer",
        "Developer",
        "Photoshop Artist",
        "VFX Artist",
        "Content Writer",
        "UI/UX",
        "Manager Executive",
      ],
      required: false,
    },
    company: {
      type: String,
      required: false,
      enum: ["Wox", "Leafway"], // Two options for dropdown
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, Skey, { expiresIn: "1d" });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
