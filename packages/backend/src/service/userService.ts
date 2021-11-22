import { User } from '../model/User';

const getUserByName = async name => {
  const user = await User.findOne({ name });
  return user;
};

export { getUserByName };
