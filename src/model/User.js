const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      unique: true,
    },
    premiumDatasets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset"
    }],
    password: {
      type: String,
    },
    online: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: 'user'
    },
    allowExportData: {
      type: Boolean,
      default: false
    },
    allowCombineDatasets: {
      type: Boolean,
      default: false
    },
    userDatasets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset"
    }],
    allDatasetsOfUser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset"
    }]
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// userSchema.virtual('userDatasets', {
//   ref: 'Dataset',
//   localField: '_id',
//   foreignField: 'addedBy',
//   justOne: false,
// });
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  // If the role is admin, set allowExportData and allowCombineDatasets to true
  // if (this.role === 'admin') {
  //   this.allowExportData = true;
  //   this.allowCombineDatasets = true;
  // }

  if (this.password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});


module.exports = mongoose.model("User", userSchema);
