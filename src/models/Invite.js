const mongoose = require('mongoose');
const { Schema } = mongoose;

const InviteSchema = new Schema({
  type: { type: String, enum: ['HOST'], default: 'HOST', index: true  },
  refId: { type: Schema.Types.ObjectId, required: true, index: true  },
  invitor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true  },
  invitee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  as: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER', required: true, index: true  }
}, { timestamps: true });

InviteSchema.statics.add = function (invite) {
  const newInvite = new Invite({
    type: invite.type,
    refId: invite.refId,
    invitor: invite.invitor,
    invitee: invite.invitee,
    as: invite.as
  });
  return newInvite.save();
};

const Invite = mongoose.model('Invite', InviteSchema);

module.exports = Invite;
