module.exports = {
  createHost: require('./createHost'),
  getHosts: require('./getHosts'),
  getHostById: require('./getHostById'),
  sendInvites: require('./sendInvites'),
  getUserRequests: require('./getUserRequests'),
  sendUserRequest: require('./sendHostRequest'),
  acceptUserRequest: require('./acceptUserRequest'),
  acceptNewHost: require('./acceptNewHost'),
  disapproveHost: require('./disapproveHost'),
  searchHostPaginated: require('./searchHostPaginated'),
  rejectHostRequest: require('./rejectHostRequest'),
  setAsAdmin: require('./setAsAdmin')
};
